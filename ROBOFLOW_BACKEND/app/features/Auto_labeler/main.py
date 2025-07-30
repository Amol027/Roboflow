from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from database import SessionLocal
import models  # <-- ✅ Add this import
from yolov_processor import YOLOProcessor
from retinanet_processor import RetinaNetProcessor
import io

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/auto-label")
def auto_label(
    model_name: str = Form(...),
    
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_bytes = file.file.read()
    request = type("Req", (), {
       
    })()

    if model_name.lower() == "yolo":
        processor = YOLOProcessor()
    elif model_name.lower() == "retinanet":
        processor = RetinaNetProcessor()
    else:
        raise HTTPException(status_code=400, detail="Invalid model name")

    return processor.process(file_bytes, request, db)

@app.get("/download")
def download_zip(id: int, db: Session = Depends(get_db)):
    record = db.query(models.DetectionModelTraining).filter_by(id=id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return Response(
        content=record.output_zip,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=output_{id}.zip"}
    )
