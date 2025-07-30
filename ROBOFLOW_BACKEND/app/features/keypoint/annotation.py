from PIL import Image, ImageDraw
import cv2, torch, tempfile, logging
from pathlib import Path
from ultralytics import YOLO
import numpy as np
import io, os, zipfile, random
from sqlalchemy.orm import Session
from datetime import datetime
from app.models import AnnotationRun

logging.basicConfig(level=logging.INFO)

NUM_KEYPOINTS = 17
KEYPOINT_DIM = 3

class Yolov8PoseLabeler:
    def __init__(self, model_name="yolov8n-pose.pt"):
        self.model_path = Path(__file__).resolve().parent / "models" / model_name
        self.model = YOLO(str(self.model_path))
        self.skeleton = [
            (5, 7), (7, 9), (6, 8), (8, 10), (5, 6),
            (11, 13), (13, 15), (12, 14), (14, 16),
            (11, 12), (5, 11), (6, 12)
        ]
        self.conf_thresh = 0.3

    def annotate_zip(self, input_zip_bytes: bytes) -> bytes:
        with tempfile.TemporaryDirectory() as temp_dir:
            base_image_dir = Path(temp_dir) / "dataset" / "images"
            base_label_dir = Path(temp_dir) / "dataset" / "labels"

            train_img_dir = base_image_dir / "train"
            val_img_dir = base_image_dir / "val"
            train_lbl_dir = base_label_dir / "train"
            val_lbl_dir = base_label_dir / "val"

            train_img_dir.mkdir(parents=True, exist_ok=True)
            val_img_dir.mkdir(parents=True, exist_ok=True)
            train_lbl_dir.mkdir(parents=True, exist_ok=True)
            val_lbl_dir.mkdir(parents=True, exist_ok=True)

            extracted_dir = Path(temp_dir) / "extracted"
            extracted_dir.mkdir(exist_ok=True)

            with zipfile.ZipFile(io.BytesIO(input_zip_bytes), 'r') as zip_ref:
                zip_ref.extractall(extracted_dir)

            image_files = [f for f in extracted_dir.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
            random.shuffle(image_files)

            split_index = int(len(image_files) * 0.9)
            train_files = image_files[:split_index]
            val_files = image_files[split_index:]

            for file in image_files:
                is_train = file in train_files
                out_img_dir = train_img_dir if is_train else val_img_dir
                out_lbl_dir = train_lbl_dir if is_train else val_lbl_dir

                img = cv2.imread(str(file))
                if img is None:
                    logging.warning(f"Could not read image: {file}")
                    continue

                results = self.model(img)[0]
                output_img = img.copy()

                if not results.keypoints or results.keypoints.data is None or results.keypoints.conf is None:
                    logging.info(f"No keypoints found in {file.name}")
                    continue

                height, width = img.shape[:2]

                for i, kps in enumerate(results.keypoints.data):
                    confs = results.keypoints.conf[i]
                    valid_kpt_count = (confs > self.conf_thresh).sum().item()
                    if valid_kpt_count < 4:
                        logging.info(f"Skipping {file.name} due to low keypoint count.")
                        continue

                    keypoints = kps[:, :2].cpu().numpy()
                    visibility = (confs > self.conf_thresh).cpu().numpy().astype(int)

                    for x, y in keypoints:
                        if x > 0 and y > 0:
                            cv2.circle(output_img, (int(x), int(y)), 3, (0, 255, 0), -1)
                    for p1, p2 in self.skeleton:
                        if p1 < len(keypoints) and p2 < len(keypoints):
                            x1, y1 = keypoints[p1]
                            x2, y2 = keypoints[p2]
                            if x1 > 0 and y1 > 0 and x2 > 0 and y2 > 0:
                                cv2.line(output_img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

                    # --- Prepare keypoint values ---
                    keypoint_values = []
                    visible_points = []

                    for idx in range(NUM_KEYPOINTS):
                        if idx < len(keypoints) and visibility[idx]:
                            x, y = keypoints[idx]
                            x_norm = x / width
                            y_norm = y / height
                            keypoint_values.extend([round(x_norm, 6), round(y_norm, 6), 1])
                            visible_points.append((x, y))
                        else:
                            keypoint_values.extend([0.0, 0.0, 0])

                    if len(keypoint_values) != NUM_KEYPOINTS * KEYPOINT_DIM or not visible_points:
                        logging.warning(f"Incomplete keypoint data in {file.name}, skipping.")
                        continue

                    # --- Calculate bounding box from visible keypoints ---
                    xs, ys = zip(*visible_points)
                    x_min, y_min = min(xs), min(ys)
                    x_max, y_max = max(xs), max(ys)

                    x_center = ((x_min + x_max) / 2) / width
                    y_center = ((y_min + y_max) / 2) / height
                    bbox_width = (x_max - x_min) / width
                    bbox_height = (y_max - y_min) / height

                    bbox_values = [round(x_center, 6), round(y_center, 6), round(bbox_width, 6), round(bbox_height, 6)]

                    label_values = [0] + bbox_values + keypoint_values  # ➜ Total = 56 values
                    label_txt = " ".join(map(str, label_values))
                    label_filename = file.stem + ".txt"
                    with open(out_lbl_dir / label_filename, "w") as f:
                        f.write(label_txt.strip())

                    cv2.imwrite(str(out_img_dir / file.name), output_img)

            output_buffer = io.BytesIO()
            with zipfile.ZipFile(output_buffer, "w", zipfile.ZIP_DEFLATED) as out_zip:
                for root, _, files in os.walk(Path(temp_dir) / "dataset"):
                    for file in files:
                        abs_path = os.path.join(root, file)
                        rel_path = os.path.relpath(abs_path, Path(temp_dir))
                        out_zip.write(abs_path, rel_path)

            return output_buffer.getvalue()

class Yolov8nPoseLabeler(Yolov8PoseLabeler):
    def __init__(self):
        super().__init__("yolov8n-pose.pt")

class Yolov8xPoseLabeler(Yolov8PoseLabeler):
    def __init__(self):
        super().__init__("yolov8x-pose.pt")

def save_annotation_run(db: Session, project_id: str, model_used: str, input_zip: bytes, output_zip: bytes) -> int:
    record = AnnotationRun(
        project_id=project_id,
        model_used=model_used,
        input_zip=input_zip,
        output_zip=output_zip,
        timestamp=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record.id