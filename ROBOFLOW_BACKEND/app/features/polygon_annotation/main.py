from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from db import SessionLocal
from models import PolygonAnnotationRecord
from datetime import datetime
from io import BytesIO
import zipfile, tempfile, shutil, logging
from pathlib import Path

from yolov8x_processor import PolygonSegmenter
from maskrcnn_processor import MaskRCNNSegmenter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Load models
yolov8x = PolygonSegmenter()
maskrcnn = MaskRCNNSegmenter()

@app.post("/polygon-segment")
async def polygon_segment(file: UploadFile = File(...), model_type: str = "yolov8x"):
    filename = file.filename
    file_bytes = await file.read()

    if model_type == "yolov8x":
        segmenter = yolov8x
    elif model_type == "maskrcnn":
        segmenter = maskrcnn
    else:
        raise HTTPException(status_code=400, detail="Invalid model_type")

    if filename.endswith(".zip"):
        temp_dir = tempfile.mkdtemp()
        zip_path = Path(temp_dir) / filename
        with open(zip_path, "wb") as f:
            f.write(file_bytes)

        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)

        output_zip_bytes = BytesIO()
        total_objects = 0

        with zipfile.ZipFile(output_zip_bytes, "w") as zip_out:
            for img_path in Path(temp_dir).rglob("*"):
                if img_path.suffix.lower() not in segmenter.supported_exts:
                    continue
                with open(img_path, "rb") as img_file:
                    img_bytes = img_file.read()
                    output_img, obj_count = segmenter.segment_image(img_bytes, img_path.name)
                    zip_out.writestr(img_path.name, output_img)
                    total_objects += obj_count

        shutil.rmtree(temp_dir)

        if total_objects == 0:
            raise HTTPException(status_code=400, detail="No valid images in ZIP")

        db: Session = SessionLocal()
        record = PolygonAnnotationRecord(
            project_name="Polygon Annotation",
            task_name=f"{model_type} ZIP",
            model_name=model_type,
            model_path=segmenter.model_path if hasattr(segmenter, 'model_path') else "torchvision",
            image_name=filename,
            object_count=total_objects,
            output_image=output_zip_bytes.getvalue(),
            status="Completed",
            created_at=datetime.utcnow()
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        db.close()

        return {"message": "✅ ZIP processed", "record_id": record.id, "total_objects": total_objects}

    else:
        output_img, obj_count = segmenter.segment_image(file_bytes, filename)

        db: Session = SessionLocal()
        record = PolygonAnnotationRecord(
            project_name="Polygon Annotation",
            task_name=f"{model_type} single",
            model_name=model_type,
            model_path=segmenter.model_path if hasattr(segmenter, 'model_path') else "torchvision",
            image_name=filename,
            object_count=obj_count,
            output_image=output_img,
            status="Completed",
            created_at=datetime.utcnow()
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        db.close()

        return {"message": "✅ Image processed", "record_id": record.id, "total_objects": obj_count}

@app.get("/preview-polygon-output/{record_id}")
def preview_polygon_output(record_id: int):
    db: Session = SessionLocal()
    record = db.query(PolygonAnnotationRecord).filter(PolygonAnnotationRecord.id == record_id).first()
    db.close()

    if not record or not record.output_image:
        raise HTTPException(status_code=404, detail="Output not found")

    content_type = "application/zip" if record.image_name.endswith(".zip") else "image/jpeg"
    return StreamingResponse(BytesIO(record.output_image), media_type=content_type)

@app.get("/download-polygon-output/{record_id}")
def download_polygon_output(record_id: int):
    db: Session = SessionLocal()
    record = db.query(PolygonAnnotationRecord).filter(PolygonAnnotationRecord.id == record_id).first()
    db.close()

    if not record or not record.output_image:
        raise HTTPException(status_code=404, detail="Output not found")

    filename = "output.zip" if record.image_name.endswith(".zip") else "output.jpg"
    content_type = "application/zip" if filename.endswith(".zip") else "image/jpeg"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return StreamingResponse(BytesIO(record.output_image), media_type=content_type, headers=headers)

@app.get("/")
def root():
    return {
        "message": "🎯 Unified Polygon Segmentation API",
        "POST /polygon-segment": {
            "params": ["file", "model_type (yolov8x or maskrcnn)"]
        },
        "GET /preview-polygon-output/{record_id}": "Preview output image or ZIP",
        "GET /download-polygon-output/{record_id}": "Download output image or ZIP"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8005, reload=True)
