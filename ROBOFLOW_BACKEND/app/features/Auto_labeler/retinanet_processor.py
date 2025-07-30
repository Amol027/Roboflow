import torch
import torchvision.transforms as T
import torchvision.models.detection as detection
import zipfile
import io
from datetime import datetime
from PIL import Image
import cv2
import numpy as np
from models import DetectionModelTraining
import os

COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag',
    'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite',
    'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana',
    'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table',
    'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock',
    'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]


class RetinaNetProcessor:
    def __init__(self, conf_thresh=0.25):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = detection.retinanet_resnet50_fpn(weights="DEFAULT").to(self.device)
        self.model.eval()
        self.conf_thresh = conf_thresh
        self.transform = T.Compose([T.ToTensor()])

    def process(self, file_bytes, req, db):
        input_zip = zipfile.ZipFile(io.BytesIO(file_bytes))
        output_buffer = io.BytesIO()
        output_zip = zipfile.ZipFile(output_buffer, 'w')

        max_score = -1
        x_min = y_min = x_max = y_max = 0
        class_labels = set()

        for name in input_zip.namelist():
            if name.lower().endswith((".jpg", ".png", ".jpeg")):
                img_bytes = input_zip.read(name)
                pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                img_tensor = self.transform(pil_img).unsqueeze(0).to(self.device)
                original_image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

                with torch.no_grad():
                    preds = self.model(img_tensor)[0]

                for i, score in enumerate(preds["scores"]):
                    if score < self.conf_thresh:
                        continue

                    box = preds["boxes"][i].tolist()
                    label_id = preds["labels"][i].item()
                    if label_id < len(COCO_INSTANCE_CATEGORY_NAMES):
                        label = COCO_INSTANCE_CATEGORY_NAMES[label_id]
                        class_labels.add(label)

                        x1, y1, x2, y2 = map(int, box)
                        x_min = min(x_min, x1) if max_score >= 0 else x1
                        y_min = min(y_min, y1) if max_score >= 0 else y1
                        x_max = max(x_max, x2) if max_score >= 0 else x2
                        y_max = max(y_max, y2) if max_score >= 0 else y2
                        max_score = max(max_score, score.item())

                        cv2.rectangle(original_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(original_image, f"{label}: {score:.2f}", (x1, max(20, y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

                _, enc = cv2.imencode(".jpg", original_image)
                output_zip.writestr(name, enc.tobytes())

        output_zip.close()

        record = DetectionModelTraining(
            
            model_name="RetinaNet",
            raw_zip=file_bytes,
            output_zip=output_buffer.getvalue(),
            num_classes=len(class_labels),
            class_names=", ".join(class_labels),
            data_size=len(file_bytes),
            confidence_score=max_score,
            x_min=x_min,
            y_min=y_min,
            x_max=x_max,
            y_max=y_max,
            timestamp=datetime.now(),
            status="Completed",
            
        )
        db.add(record)
        db.commit()
        return {"message": "RetinaNet processing done."}
