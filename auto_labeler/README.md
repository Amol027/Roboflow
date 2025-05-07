Auto Labeler
Auto Labeler is a Python-based object detection tool that uses the YOLOv8 model to automatically label objects in images. It outputs labeled images with bounding boxes and a CSV file containing detection metadata (labels, confidence, and coordinates).

📦 Features
Uses the YOLOv8x model (high-accuracy variant)

Automatically processes all images in a folder

Draws bounding boxes and labels on detected objects

Saves results both as labeled images and a CSV file

## 📦 Installation

### 1. Clone the repository (or download manually)

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

### 2. Install Dependencies

pip install -r requirements.txt

▶️ How to Run
1.Place all your input images in the folder:

auto_labeler/data/images/

2.Run the labeling script:
 
python train.py

3.After the script runs:

Labeled images will be saved in auto_labeler/output/labeled_images/

A CSV file labeled_output_with_boxes.csv will be created in auto_labeler/output/ with the bounding box data.

### NOTE :
Make sure to update the script paths (image_folder, output_folder, etc.) if you change the directory structure.
