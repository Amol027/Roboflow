# 🧩 Polygon Annotation API (YOLOv8 + Mask R-CNN)
Polygon annotation is a method of labeling objects in an image by outlining their exact shape using connected points (polygons), rather than simple bounding boxes. This provides more accurate segmentation, especially for complex or irregular objects.

This project provides two REST APIs using FastAPI:

One powered by YOLOv8 Segmentation models

Another powered by Mask R-CNN

Both APIs perform polygon annotation on images and return annotated outputs with basic accuracy metrics.

# how to install requirements
..bash
pip install -r requirements.txt

▶️ Running the Project
🔹 1. YOLOv8 Polygon Segmentation API (Port 8000)
Start the server:
python yolov.py

Request Format:

json

{
  "image_folder": "path/to/input/images",
  "output_folder": "path/to/save/annotated/images"
}

🔹 2. Mask R-CNN Polygon Segmentation API (Port 8001)
Start the server:
python maskrcnn.py

# 📤 Output
Both APIs return:

Annotated images saved to output_folder

Class labels and polygon overlays

JSON response with:

Processed image list

training_accuracy (%): % of images with detections

testing_accuracy (avg objects/image): average number of detections per image