# 🧠 Keypoint Annotations API (YOLOv8, MediaPipe & MoveNet)

Keypoint annotations refer to identifying and labeling specific points (joints) on a human body, such as shoulders, elbows, or knees, in an image.  
These annotations are used for tasks like human pose estimation, gesture recognition, and activity analysis.  
This project provides APIs using YOLOv8, MediaPipe, and MoveNet to automate pose annotation for a folder of images.

---

## 📦 Installation

```bash
pip install -r requirements.txt

# Python Version
Use Python 3.10 for best compatibility with all models, especially mediapipe and tensorflow.

🚀 How to Run
Each model runs independently on its own port using FastAPI.

1. YOLOv8n (Port 8000)

python yolov8n:app --reload

2. MediaPipe (Port 8001)

python MediaPipe:app --reload
3. MoveNet (Port 8002)

python movenet:app --reload
📂 Once running, open http://localhost:PORT/docs to access Swagger UI where you can POST the input and output folder paths.

📁 Example POST Request Body

{
  "image_folder": "C:\\Users\\YourName\\Pictures\\input_images",
  "output_folder": "C:\\Users\\YourName\\Pictures\\labeled_output"
}
✅ Supported Image Formats
.jpg, .jpeg, .png, .bmp (YOLOv8 & MediaPipe)

.jpg, .jpeg, .png (MoveNet)

🧩 Use Cases
Human Pose Estimation

Fitness Applications

Motion Tracking in Sports

Gesture Recognition

Augmented Reality (AR)

⚠️ Notes
Make sure the input folder contains valid image files.

If models are not downloaded, they will be auto-downloaded the first time you run the API.

