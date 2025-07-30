import io
import zipfile
import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
from io import BytesIO
from app.database import get_db
from app.models import AnnotationRun, KeypointTrainingRun,PosePredictionRecord
from app.features.keypoint.annotation import Yolov8nPoseLabeler, Yolov8xPoseLabeler, save_annotation_run
from app.features.keypoint.train import train_keypoint_model as train_model
from app.features.keypoint.predict import predict_pose_from_zip
router = APIRouter(tags=["keypoint"])

# Load models from local "models/" directory
yolo_model = Yolov8nPoseLabeler()     # loads yolov8n-pose.pt
movenet_model = Yolov8xPoseLabeler()  # loads yolov8x-pose.pt


@router.post("/autolabel")
async def autolabel_keypoints(
    project_id: str = Form(...),
    model_choice: str = Form(...),  # "yolov8n" or "yolov8x"
    zip_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        if not zip_file.filename.endswith(".zip"):
            raise HTTPException(status_code=400, detail="Only .zip files are supported")

        zip_bytes = await zip_file.read()

        # Select model
        if model_choice.lower() == "yolov8n":
            output_zip = yolo_model.annotate_zip(zip_bytes)
        elif model_choice.lower() == "yolov8x":
            output_zip = movenet_model.annotate_zip(zip_bytes)
        else:
            raise HTTPException(status_code=400, detail="Invalid model choice")

        # Save to DB
        run_id = save_annotation_run(
            db=db,
            project_id=project_id,
            model_used=model_choice,
            input_zip=zip_bytes,
            output_zip=output_zip,
        )

        return {
            "message": "Annotation completed successfully.",
            "run_id": run_id,
        }

    except Exception as e:
        logging.exception("Autolabelling failed")
        raise HTTPException(status_code=500, detail="Autolabelling failed. Reason: " + str(e))


@router.get("/download/{run_id}")
def download_annotated_zip(run_id: int, db: Session = Depends(get_db)):
    try:
        record = db.query(AnnotationRun).filter(AnnotationRun.id == run_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Run not found")

        return StreamingResponse(
            io.BytesIO(record.output_zip),
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=annotated_output_{run_id}.zip"}
        )

    except Exception as e:
        logging.exception("Download failed")
        raise HTTPException(status_code=500, detail="Download failed. Reason: " + str(e))


@router.post("/keypoint/train")
def train_keypoint(
    project_id: str = Form(...),
    model_name: str = Form(...),        # "yolov8n" or "yolov8x"
    annotation_id: int = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # Train model using dataset in the annotation ZIP
        training_id, metrics = train_model(
            db=db,
            project_id=project_id,
            model_name=model_name,
            annotation_id=annotation_id
        )

        return {
            "status": "success",
            "training_id": training_id,
            "metrics": metrics
        }

    except Exception as e:
        logging.exception("Training failed")
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@router.post("/keypoint/predict")
def predict_keypoint_route(
    training_id: int = Form(...),
    zip_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        if not zip_file.filename.endswith(".zip"):
            raise HTTPException(status_code=400, detail="Only ZIP files are allowed")

        zip_bytes = zip_file.file.read()

        if not zip_bytes:
            raise HTTPException(status_code=400, detail="Uploaded ZIP is empty")

        return predict_pose_from_zip(training_id, zip_bytes, db)

    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        logging.error(f"Pose prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")
    
@router.get("/keypoint/download/{prediction_id}")
def download_keypoint_output(prediction_id: int, db: Session = Depends(get_db)):
    try:
        prediction = db.query(PosePredictionRecord).filter(PosePredictionRecord.id == prediction_id).first()

        if not prediction:
            raise HTTPException(status_code=404, detail="Prediction not found")

        if not prediction.output_zip:
            raise HTTPException(status_code=404, detail="No output ZIP available")

        return StreamingResponse(
            BytesIO(prediction.output_zip),
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=pose_output_{prediction_id}.zip"}
        )

    except Exception as e:
        logging.error(f"Download failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during download")