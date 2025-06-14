from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import os
import shutil
import zipfile
import logging
from ultralytics import YOLO
from datetime import datetime
import uvicorn
# Setup
app = FastAPI()
BASE_DIR = "uploaded_datasets"
os.makedirs(BASE_DIR, exist_ok=True)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/train/yolo")
async def train_yolo(file: UploadFile = File(...)):
    try:
        # Save ZIP file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        dataset_id = f"dataset_{timestamp}"
        dataset_path = os.path.join(BASE_DIR, dataset_id)
        zip_path = os.path.join(dataset_path, file.filename)
        os.makedirs(dataset_path, exist_ok=True)

        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract ZIP
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(dataset_path)

        # Create YOLO model
        model = YOLO("yolov8n.pt")

        # Train
        result = model.train(
            data=os.path.join(dataset_path, "data.yaml"),
            imgsz=640,
            epochs=10,
            batch=8,
            project=dataset_path,
            name="yolo_training",
            exist_ok=True
        )

        # Read metrics from terminal output file
        result_file = os.path.join(dataset_path, "yolo_training", "results.txt")
        summary = None

        if os.path.exists(result_file):
            with open(result_file, "r") as f:
                summary = f.read()
        else:
            summary = "Training completed, but metrics table not found."

        return JSONResponse(content={
            "status": "success",
            "summary": summary
        })

    except Exception as e:
        logger.exception("YOLO training failed.")
        return JSONResponse(status_code=500, content={
            "status": "error",
            "message": str(e)
        })
if __name__ == "__main__":
    uvicorn.run("yolo1:app", host="127.0.0.1", port=8001, reload=True)