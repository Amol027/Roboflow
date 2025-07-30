from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from .yolov_processor import YOLOProcessor
from .retinanet_processor import RetinaNetProcessor
import models

router = APIRouter()

@router.post("/auto-label")
def auto_label(
    model_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_bytes = file.file.read()

    if model_name.lower() == "yolo":
        processor = YOLOProcessor()
    elif model_name.lower() == "retinanet":
        processor = RetinaNetProcessor()
    else:
        raise HTTPException(status_code=400, detail="Invalid model name")

    return processor.process(file_bytes, {}, db)

@router.get("/download")
def download_zip(id: int, db: Session = Depends(get_db)):
    record = db.query(models.DetectionModelTraining).filter_by(id=id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return Response(
        content=record.output_zip,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=output_{id}.zip"}
    )
