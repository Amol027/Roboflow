import io
import zipfile
import tempfile
import numpy as np
import cv2
import os
from datetime import datetime
from ultralytics import YOLO
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import KeypointTrainingRun, PosePredictionRecord

# Define COCO-style skeleton (customizable if needed)
CUSTOM_SKELETON = [
    (5, 7), (7, 9),        # Left arm
    (6, 8), (8, 10),       # Right arm
    (5, 6),                # Shoulders
    (11, 13), (13, 15),    # Left leg
    (12, 14), (14, 16),    # Right leg
    (11, 12),              # Hips
    (5, 11), (6, 12)       # Side torso
]

def draw_custom_keypoints(image, keypoints, skeleton, color=(0, 255, 0), radius=4):
    for x, y, conf in keypoints:
        if conf > 0.3 and (x != 0 or y != 0):
            cv2.circle(image, (int(x), int(y)), radius, color, -1)

    for i, j in skeleton:
        if i < len(keypoints) and j < len(keypoints):
            x1, y1, c1 = keypoints[i]
            x2, y2, c2 = keypoints[j]
            if (x1 != 0 or y1 != 0) and (x2 != 0 or y2 != 0) and c1 > 0.3 and c2 > 0.3:
                cv2.line(image, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)

def predict_pose_from_zip(training_id: int, zip_bytes: bytes, db: Session):
    try:
        trainer_record = db.query(KeypointTrainingRun).filter(
            KeypointTrainingRun.id == training_id
        ).first()

        if not trainer_record or not trainer_record.trained_model:
            raise HTTPException(status_code=404, detail="Trained model not found.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pt") as temp_model_file:
            temp_model_file.write(trainer_record.trained_model)
            temp_model_file.flush()

        model = YOLO(temp_model_file.name)
        output_buffer = io.BytesIO()

        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as input_zip, zipfile.ZipFile(output_buffer, "w") as output_zip:
            for file_name in input_zip.namelist():
                if not file_name.lower().endswith((".jpg", ".jpeg", ".png")):
                    continue

                image_data = input_zip.read(file_name)
                np_img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
                base_filename = os.path.splitext(os.path.basename(file_name))[0]

                result = model.predict(source=np_img, save=False, verbose=False)[0]

                if not result.keypoints or result.keypoints.data is None:
                    continue

                keypoints_tensor = result.keypoints.data.cpu().numpy()
                if keypoints_tensor.shape[0] == 0:
                    continue

                for idx, person_kp in enumerate(keypoints_tensor):
                    clean_kp = [
                        (float(x), float(y), float(v)) if v > 0.3 and (x != 0 or y != 0) else (0.0, 0.0, 0.0)
                        for x, y, v in person_kp
                    ]
                    draw_custom_keypoints(np_img, clean_kp, CUSTOM_SKELETON)

                    cls_id = (
                        int(result.boxes.cls[idx]) if result.boxes and idx < len(result.boxes.cls)
                        else 0
                    )

                    keypoints_flat = " ".join(f"{x:.6f} {y:.6f} {v:.1f}" for x, y, v in clean_kp)
                    label_line = f"{cls_id} {keypoints_flat}"
                    label_path = f"labels/{base_filename}_{idx}.txt"
                    output_zip.writestr(label_path, label_line)

                _, encoded_image = cv2.imencode(".jpg", np_img)
                output_zip.writestr(f"images/{base_filename}.jpg", encoded_image.tobytes())

        # Save prediction to database
        prediction_record = PosePredictionRecord(
            training_id=training_id,
            input_zip=zip_bytes,
            output_zip=output_buffer.getvalue(),
            created_at=datetime.utcnow(),
        )
        db.add(prediction_record)
        db.commit()
        db.refresh(prediction_record)

        # Save ZIP locally and then delete it
        debug_zip_path = f"pose_output_{prediction_record.id}.zip"
        try:
            with open(debug_zip_path, "wb") as f:
                f.write(prediction_record.output_zip)
            print(f"[DEBUG] Saved ZIP: {debug_zip_path}")

            if os.path.exists(debug_zip_path):
                os.remove(debug_zip_path)
                print(f"[CLEANUP] Deleted ZIP: {debug_zip_path}")
        except Exception as zip_err:
            print(f"[WARNING] ZIP save/delete failed: {zip_err}")

        # Delete temp model file
        try:
            if os.path.exists(temp_model_file.name):
                os.remove(temp_model_file.name)
        except Exception as e:
            print(f"[WARNING] Failed to delete temp model file: {e}")

        return {
            "status": "success",
            "message": "Pose prediction completed and saved.",
            "download_url": f"/keypoint/download/{prediction_record.id}"
        }

    except Exception as e:
        import logging
        logging.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Pose prediction failed: {str(e)}")
