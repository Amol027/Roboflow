# Auto Labeler FastAPI 🔍📦

This project provides a FastAPI-based service that uses the YOLOv8 model to automatically label objects in images from a specified folder. It draws bounding boxes on detected objects, saves the labeled images, and generates a CSV file with class names, coordinates, and confidence scores. Ideal for rapid image dataset annotation.

## ✅ Features

- Auto-download YOLO models on first run — no manual model setup
- Supports YOLOv5, YOLOv8x, YOLOv9c, YOLOv9s, mobilenetssd
- Outputs:
  - Labeled images with bounding boxes
  - CSV with label, confidence, and bounding box coordinates

---

## ⚙️ Setup Instructions

### 1. 📦 Install Requirements

```bash
pip install -r requirements.txt
2. 🚀 Run Any API
Ensure output/labelled_images/ folder exists before running.

🔷 YOLOv8x API
python yolov8x_app.py
# Runs at: http://127.0.0.1:8000

🔷 YOLOv5 API
python yolov5_app.py
# Runs at: http://127.0.0.1:8001

🔷 YOLOv9c API
python yolov9c_app.py
# Runs at: http://127.0.0.1:8002

🔷 YOLOv9s API
python yolov9s_app.py
# Runs at: http://127.0.0.1:8003

🔷 YOLOv9s API
python mobilenetssd.py
# Runs at: http://127.0.0.1:8004

📬 API Endpoint
POST /auto-label
Request JSON:

{
  "image_folder": "C:\\path\\to\\your\\images",
  "output_folder": "C:\\path\\to\\your\\output"
}
Response:
{
  "message": "Labeling completed successfully",
  "labeled_images_folder": "C:\\...\\labelled_images",
  "csv_file": "C:\\...\\labeled_output_with_boxes.csv"
}

📁Project_Structure

autolabeler/
├── yolov5_app.py         # YOLOv5 API on port 8001
├── yolov8x_app.py        # YOLOv8x API on port 8000
├── yolov9c_app.py        # YOLOv9c API on port 8002
├── mobilenetssd.py        # YOLOv9s API on port 8003
├── requirements.txt      # Dependencies
├── README.md             # Project instructions
└── output/
    ├── labelled_images/          # ← Annotated images saved here
    │   ├── labeled_image1.jpg
    │   ├── labeled_image2.jpg
    │   └── ...
    └── labeled_output_with_boxes.csv  # ← Detection results as CSV
