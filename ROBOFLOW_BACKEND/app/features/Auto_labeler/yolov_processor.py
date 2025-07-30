from ultralytics import YOLO
import zipfile
import cv2
import io
from datetime import datetime
from models import DetectionModelTraining
import numpy as np
import os

class YOLOProcessor:
    def __init__(self, conf_thresh=0.25):
        self.model = YOLO("models/yolov8x.pt")
        self.conf_thresh = conf_thresh

    def process(self, file_bytes, req, db):
        input_zip = zipfile.ZipFile(io.BytesIO(file_bytes))
        output_buffer = io.BytesIO()
        output_zip = zipfile.ZipFile(output_buffer, 'w')

        max_conf = -1
        x_min = y_min = x_max = y_max = 0
        class_labels = set()

        for name in input_zip.namelist():
            if name.lower().endswith((".jpg", ".png", ".jpeg")):
                img_bytes = input_zip.read(name)
                np_arr = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                results = self.model(img, conf=self.conf_thresh)
                labeled_image = img.copy()

                for result in results:
                    for box in result.boxes:
                        conf = float(box.conf)
                        label = self.model.names[int(box.cls)]
                        class_labels.add(label)
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        x_min = min(x_min, x1) if max_conf >= 0 else x1
                        y_min = min(y_min, y1) if max_conf >= 0 else y1
                        x_max = max(x_max, x2) if max_conf >= 0 else x2
                        y_max = max(y_max, y2) if max_conf >= 0 else y2
                        max_conf = max(max_conf, conf)
                        cv2.rectangle(labeled_image, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(labeled_image, f"{label}: {conf:.2f}", (x1, max(20, y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

                _, enc = cv2.imencode(".jpg", labeled_image)
                output_zip.writestr(name, enc.tobytes())

        output_zip.close()

        record = DetectionModelTraining(
          
            model_name="YOLOv8x",
            raw_zip=file_bytes,
            output_zip=output_buffer.getvalue(),
            num_classes=len(class_labels),
            class_names=", ".join(class_labels),
            data_size=len(file_bytes),
            confidence_score=max_conf,
            x_min=x_min,
            y_min=y_min,
            x_max=x_max,
            y_max=y_max,
            timestamp=datetime.now(),
            status="Completed",
           
        )
        db.add(record)
        db.commit()
        return {"message": "YOLO processing done."}