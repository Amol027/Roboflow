# Object Detection Feature

This feature contains FastAPI-oriented object-detection components for processing uploaded video with OpenCV DNN and Ultralytics YOLO.

## Contents

- `main.py` — standalone FastAPI application entry point
- `routes.py` — feature routes for integration with the main backend
- `ssd_processor.py` — OpenCV SSD processing
- `yolov_processor.py` — Ultralytics YOLO processing
- `db.py` and `models.py` — feature database setup and records
- `create_table.py` — table-creation helper

## Setup

Install the feature dependencies from this directory:

```powershell
pip install -r requirements.txt
```

The feature expects a `DATABASE_URL` environment variable. Run it as a standalone API with:

```powershell
uvicorn main:app --reload
```

For the repository-level application, use the backend instructions in `ROBOFLOW_BACKEND/requirements.txt` and integrate the feature through its routes.
