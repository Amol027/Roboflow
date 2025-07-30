import io
import os
import zipfile
import tempfile
import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from ultralytics import YOLO
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import AnnotationRun, KeypointTrainingRun
import shutil
import glob
import logging

# Thresholds for performance check
UNDERFIT_PRECISION_THRESHOLD = 0.4
UNDERFIT_MAP50_THRESHOLD = 0.3
OVERFIT_PRECISION_RECALL_GAP = 0.3
MAX_RETRIES = 2

def clean_yolo_runs():
    runs_path = "C:/Users/USER/Documents/robo/runs"
    if os.path.exists(runs_path):
        try:
            shutil.rmtree(runs_path)
            print(f"Deleted entire directory: {runs_path}")
        except Exception as e:
            print(f"Failed to delete {runs_path}: {e}")


def find_dataset_root(temp_dir: Path) -> Path:
    for root, dirs, _ in os.walk(temp_dir):
        if 'images' in dirs:
            images_dir = Path(root) / 'images'
            if (images_dir / 'train').exists() and (images_dir / 'val').exists():
                return Path(root)
    raise HTTPException(status_code=400, detail="images/train and images/val not found in dataset structure.")


def sanitize_filenames(directory: Path):
    valid_image_exts = ['.jpg', '.jpeg', '.png']
    for subdir, _, files in os.walk(directory):
        for file in files:
            file_path = Path(subdir) / file
            safe_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', file)
            new_file_path = Path(subdir) / safe_name

            if file_path != new_file_path:
                file_path.rename(new_file_path)
                if file_path.suffix.lower() in valid_image_exts:
                    label_dir = directory.parent / "labels" / Path(subdir).name
                    old_label_path = label_dir / (file_path.stem + ".txt")
                    new_label_path = label_dir / (new_file_path.stem + ".txt")
                    if old_label_path.exists():
                        old_label_path.rename(new_label_path)


def train_keypoint_model(project_id: str, model_name: str, annotation_id: int, db: Session):
    annotation = db.query(AnnotationRun).filter(AnnotationRun.id == annotation_id).first()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation ID not found")

    with tempfile.TemporaryDirectory() as temp_dir_str:
        temp_dir = Path(temp_dir_str)

        # Save and extract ZIP
        zip_path = temp_dir / "dataset.zip"
        with open(zip_path, "wb") as f:
            f.write(annotation.output_zip)

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)

        sanitize_filenames(temp_dir)
        dataset_root = find_dataset_root(temp_dir)

        # Write data.yaml
        data_yaml_path = temp_dir / "data.yaml"
        yaml_content = f"""
path: {dataset_root}
train: images/train
val: images/val
nc: 1
names: ["person"]
kpt_shape: [17, 3]
"""
        data_yaml_path.write_text(yaml_content.strip())

        # Select model
        models_dir = Path(__file__).resolve().parent / "models"
        if model_name.lower() == "yolov8n":
            model_path = models_dir / "yolov8n-pose.pt"
        elif model_name.lower() == "yolov8x":
            model_path = models_dir / "yolov8x-pose.pt"
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported model: {model_name}")

        if not model_path.exists():
            raise HTTPException(status_code=500, detail=f"Model file not found: {model_path.name}")

        # Retraining logic
        for attempt in range(MAX_RETRIES + 1):
            model = YOLO(str(model_path))
            results = model.train(data=str(data_yaml_path), epochs=10 + attempt * 5, imgsz=640)

            # Parse metrics
            metrics_file = Path(model.trainer.save_dir) / "results.json"
            if metrics_file.exists():
                with open(metrics_file, "r") as f:
                    results_json = json.load(f)
                    last = results_json[-1] if results_json else {}
            else:
                last = results.results_dict or {}

            precision = last.get("metrics/precision(B)", 0.0)
            recall = last.get("metrics/recall(B)", 0.0)
            map50 = last.get("metrics/mAP50(B)", 0.0)
            map50_95 = last.get("metrics/mAP50-95(B)", 0.0)

            underfit = precision < UNDERFIT_PRECISION_THRESHOLD or map50 < UNDERFIT_MAP50_THRESHOLD
            overfit = abs(precision - recall) > OVERFIT_PRECISION_RECALL_GAP

            if not underfit and not overfit:
                break  # good model
            elif attempt == MAX_RETRIES:
                raise HTTPException(status_code=500, detail="Model underfitting or overfitting even after retries.")

        # Save final best model
        best_model_path = Path(model.trainer.save_dir) / "weights" / "best.pt"
        if not best_model_path.exists():
            raise HTTPException(status_code=500, detail="Trained model 'best.pt' not found")

        with open(best_model_path, "rb") as f:
            trained_model_binary = f.read()

        # Save training info to DB
        training_run = KeypointTrainingRun(
            project_id=project_id,
            model_used=model_name,
            annotation_id=annotation_id,
            trained_model=trained_model_binary,
            precision=precision,
            recall=recall,
            map50=map50,
            map50_95=map50_95,
            timestamp=datetime.utcnow()
        )

        db.add(training_run)
        db.commit()
        db.refresh(training_run)
        clean_yolo_runs()
        return {
            "training_id": training_run.id,
            "metrics": {
                "precision": precision,
                "recall": recall,
                "mAP50": map50,
                "mAP50-95": map50_95
            }
        }
