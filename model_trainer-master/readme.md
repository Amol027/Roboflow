# 🧠 Model Trainer (FastAPI)
This project provides FastAPI-based APIs to train machine learning and deep learning models:

🦾 YOLOv8 for object detection

⚡ XGBoost and 🌳 Random Forest for tabular data

🧠 BERT for text classification

📦 Installation
Install all required dependencies:
bash

pip install -r requirements.txt

# 🚀 How to Run the Project
Run each API server with Python (no need to use Uvicorn directly):

bash

# Run YOLOv8 API (port 8001)
python yolo1.py

# Run XGBoost API (port 8002)
python train_xgboost_api.py

# Run Random Forest API (port 8003)
python random_forest.py

# Run BERT API (port 8004)
python bert.py
Each script starts its own FastAPI server locally on the specified port.

📁 Project Structure

model_trainer/
├── bert.py                 # BERT model training API
├── random_forest.py        # Random Forest model training API
├── train_xgboost_api.py    # XGBoost model training API
├── yolo1.py                # YOLOv8 object detection API
├── requirements.txt        # List of dependencies
├── uploads/                # Uploaded files directory
├── uploaded_datasets/      # Input datasets for YOLO
├── train2/, train3/, train4/  # YOLO training output folders
├── datasets/, models/, runs/  # Optional output paths

# 📤 Upload Datasets
Upload via Swagger UI (/docs) for all models

Files are saved automatically to the uploads/ directory

| Model         | Expected Format                          | Upload Location      |
| ------------- | ---------------------------------------- | -------------------- |
| YOLOv8        | Images + YOLO labels                     | `uploaded_datasets/` |
| XGBoost       | CSV with `label` column                  | `uploads/`           |
| Random Forest | CSV with `label` column                  | `uploads/`           |
| BERT          | CSV/JSON with `text` and `label` columns | `uploads/`           |

# 📁 Output Directory
YOLOv8 output: runs/detect/train* (includes weights, metrics, etc.)

XGBoost, Random Forest, and BERT: Output metrics shown in Swagger response (no model saved by default)

# 🧪 Using Swagger UI (localhost)
Open your browser and go to http://127.0.0.1:<port>/docs

Select the appropriate POST endpoint

Click "Try it out"

Upload your dataset file

Click "Execute"

See metrics (Accuracy, Precision, Recall) in response

Example Ports:

XGBoost: 8002

Random Forest: 8003

BERT: 8004

YOLOv8: 8001