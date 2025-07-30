import numpy as np, cv2
from pathlib import Path
from ultralytics import YOLO
import requests, logging

class PolygonSegmenter:
    def __init__(self, model_path: str = "models/yolov8x-seg.pt", confidence_threshold=0.5):
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.supported_exts = ['.jpg', '.jpeg', '.png']

        model_file = Path(self.model_path)
        model_file.parent.mkdir(parents=True, exist_ok=True)

        if not model_file.exists():
            logging.info("⬇️ Downloading yolov8x-seg.pt ...")
            url = "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8x-seg.pt"
            r = requests.get(url)
            if r.status_code == 200:
                with open(model_file, "wb") as f:
                    f.write(r.content)
            else:
                raise FileNotFoundError("Model download failed")

        self.model = YOLO(str(model_file))

    def segment_image(self, img_bytes: bytes, img_name: str):
        img_np = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError(f"Invalid image: {img_name}")

        results = self.model.predict(img, conf=self.confidence_threshold, retina_masks=True, save=False)
        obj_count = 0

        for result in results:
            masks = result.masks
            names = result.names
            boxes = result.boxes
            if masks and masks.xy:
                obj_count += len(masks.xy)
                for i, poly in enumerate(masks.xy):
                    poly_np = poly.astype(int)
                    cv2.polylines(img, [poly_np], True, (0, 255, 0), 2)
                    if boxes and i < len(boxes.cls):
                        label = names.get(int(boxes.cls[i]), "obj")
                        x, y = poly_np[0]
                        cv2.putText(img, label, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

        _, enc = cv2.imencode(".jpg", img)
        return enc.tobytes(), obj_count
