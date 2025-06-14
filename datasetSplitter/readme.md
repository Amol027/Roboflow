# Dataset Splitter

## Project Overview
This project provides a FastAPI-based web service that automatically splits a dataset of images into training, validation, and test sets. It then labels each image using a YOLOv8 object detection model, saving bounding box labels in YOLO format alongside the images. This automation simplifies preparing datasets for machine learning and computer vision tasks.

This project provides three separate FastAPI services for dataset splitting and auto-labeling using different YOLO object detection models:

| Model      | Port | Endpoint Base |
|------------|------|----------------|
| YOLOv8n    | 8000 | `/split`, `/metrics` |
| YOLOv9s    | 8001 | `/split`, `/metrics` |
| YOLOv5s    | 8002 | `/split`, `/metrics` |

---

## 📁 Folder Structure
datasetSplitter/
├── yolov5s_app.py         # FastAPI app for YOLOv5s on port 8002
├── yolov8n_app.py         # FastAPI app for YOLOv8n on port 8000
├── yolov9s_app.py         # FastAPI app for YOLOv9s on port 8001
├── output/                # Folder where processed datasets are saved
│   ├── train/
│   │   ├── images/
│   │   └── labels/
│   ├── val/
│   │   ├── images/
│   │   └── labels/
│   └── test/
│       ├── images/
│       └── labels/
└── README.md              # Documentation

# install requirements:
pip install -r requirements.txt

## 🚀 How to Run

Open 3 separate terminals to run each API:

```bash
# Terminal 1 - YOLOv8n
python yolov8n_app.py

# Terminal 2 - YOLOv9s
python yolov9s_app.py

# Terminal 3 - YOLOv5s
python yolov5s_app.py
Each one runs on a different port.

📬 API Endpoints
Each model API provides:

/split (POST)
Split your dataset and auto-label each image.

Request Body:

{
  "input_folder": "C:\\path\\to\\images",
  "output_folder": "C:\\path\\to\\output"
}
/metrics (POST)
Evaluate precision/recall on the test split using predicted vs. ground truth labels.

Request Body:

{
  "iou_threshold": 0.5
}

🧠 Models Used
Model	Description
YOLOv8n	Ultralytics Nano - fastest inference
YOLOv9s	Lightweight, latest from Ultralytics
YOLOv5s	Stable and well-supported

All models are auto-downloaded if not already present.

