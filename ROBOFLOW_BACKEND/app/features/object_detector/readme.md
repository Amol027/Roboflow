
# Object Detector FastAPI 🎯🎥
=======

🧠 YOLOv8 Video Object Detection API
This project is a FastAPI-based backend for detecting objects in uploaded videos using the YOLOv8 model. It processes a video, adds bounding boxes around detected objects, and returns the path to the saved output video.


This project provides FastAPI-based APIs for running object detection on uploaded videos using:
- 📦 MobileNet SSD (OpenCV DNN)
- 🧠 Faster R-CNN (PyTorch torchvision)
- ⚡ SSD TensorFlow Model (via OpenCV DNN)
- 🧠 YOLOv8 (Ultralytics)

All models process the video frame-by-frame, draw bounding boxes with class labels, and return metadata along with storing the processed video **directly in PostgreSQL** (as byte format), and evaluation metrics like **precision**, **recall**, and **frame count**.

---

## ⚙️ Setup Instructions

### 1. 📦 Install Dependencies

```bash
pip install -r requirements.txt
2. 🚀 Run the Detector APIs
Make sure your output_videos/ folder exists — it will be auto-created if not.

Each model runs on a separate port:
# SSD
python ssdmodel.py

# FRCNN
python frcnnmodel.py
# YOLOv8
python yolov.py
🧪 API Endpoints
Each model exposes the same 3 routes:

Method	Endpoint	Description
POST	/detect-video-<model>	Upload and process video
GET	/get-output-<model>/{record_id}	Get metadata by ID
GET	/download-output-<model>/{record_id}	Download video output by ID

Replace <model> with: ssd, frcnn, or yolo

Example:
http://127.0.0.1:8003/docs     # YOLOv8 Swagger

📁 Project Structure
object_detector/
│
├── db.py                     # DB connection
├── models.py                 # SQLAlchemy schema
├── frcnnmodel.py             # Faster R-CNN API
├── yolov.py                  # YOLOv8 API
├── ssdmodel.py               # SSD API
├── create_table.py           # Table creation
├── requirements.txt
├── readme.md
├── models/                   # Contains yolov8.pt, .pb, .pbtxt, coco.names
└── output_videos/           # Temporarily used (auto-created if not exists)

