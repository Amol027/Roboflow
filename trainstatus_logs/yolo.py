from fastapi import FastAPI, UploadFile, File
import os
import logging
from typing import List
from zipfile import ZipFile

app = FastAPI(title="YOLOv5 Model Trainer")

# Setup logging
LOG_FILE = "training_logs.log"
logger = logging.getLogger("train_logger")
logger.setLevel(logging.INFO)
if not logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

# Trainer class
class Trainer:
    def __init__(self):
        self.logger = logger

    def train(self, model_type: str, dataset_path: str, epochs: int, batch_size: int):
        self.logger.info(f"Model: {model_type}, Epochs: {epochs}, Batch Size: {batch_size}")
        self.logger.info(f"Dataset Path: {dataset_path}")

        if not os.path.exists(dataset_path):
            self.logger.error(f"Dataset not found at {dataset_path}")
            return {"status": "failed", "reason": "Invalid dataset path"}

        self.logger.info(f"Training with {model_type}...")
        # Simulated training logic
        self.logger.info("Training completed successfully.")
        return {"status": "success", "model": model_type}

trainer = Trainer()

@app.get("/")
def read_root():
    return {"message": "Welcome to the YOLOv5 Model Trainer API"}

def handle_upload_and_train(file: UploadFile, model_type: str):
    # Internal default params
    epochs = 10
    batch_size = 32

    # Save and unzip
    UPLOAD_DIR = "uploaded_datasets"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        buffer.write(file.file.read())

    extracted_path = os.path.join(UPLOAD_DIR, os.path.splitext(file.filename)[0])
    with ZipFile(file_location, 'r') as zip_ref:
        zip_ref.extractall(extracted_path)
        logger.info(f"Extracted dataset to {extracted_path}")

    result = trainer.train(model_type, extracted_path, epochs, batch_size)
    result.update({
        "uploaded_file": file.filename
    })
    return result

@app.post("/train")
async def train_yolov5(file: UploadFile = File(...)):
    return handle_upload_and_train(file, "yolov5")

@app.get("/logs")
def get_logs() -> List[str]:
    if not os.path.exists(LOG_FILE):
        return []
    with open(LOG_FILE, "r") as f:
        lines = f.readlines()
    return [line.strip() for line in lines if line.strip()]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("yolo:app", host="127.0.0.1", port=8001, reload=True)