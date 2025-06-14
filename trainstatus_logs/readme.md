# 🧠 TrainStatusLogs – FastAPI Trainer for MobileNet & YOLOv5

This project provides API endpoints for training two different models:
- 📱 MobileNet (Image Classification)
- 🦾 YOLOv5 (Object Detection)

It supports dataset upload via Swagger UI, automatically unzips and logs the training steps, and provides logs via an API.

---

## ✅ Installation

Clone the repo and install required packages:

```bash
pip install -r requirements.txt
🚀 How to Run
Use the following commands to start each server:

bash

# Run MobileNet Trainer API (port 8000)
python mobilenet.py

# Run YOLOv5 Trainer API (port 8001)
python yolo.py

No need to use uvicorn, just run the .py files directly.

📤 Dataset Upload Instructions
Zip your training dataset (e.g., train_data.zip)

Upload it using Swagger UI (see below)

The dataset will be saved to: uploaded_datasets/

It will be automatically extracted for training

Ensure your ZIP file contains the correct folder structure for training (images, labels, etc.).

📁 Output Details
| Component      | Location             | Description                     |
| -------------- | -------------------- | ------------------------------- |
| Uploaded Files | `uploaded_datasets/` | Zipped datasets (and extracted) |
| Logs           | `training_logs.log`  | Training logs                   |

📄 View Logs
To retrieve logs of training status, hit the following API:

GET /logs
It returns a list of log lines from training_logs.log.

🧪 Swagger UI (API Usage)
Visit Swagger UI for interactive API usage:
| API Title         | Swagger URL                                              |
| ----------------- | -------------------------------------------------------- |
| MobileNet Trainer | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| YOLOv5 Trainer    | [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs) |

### 
How to Train:

Open the URL in browser

Click POST /train

Click "Try it out"

Upload your zipped dataset

Click "Execute"

Response will show training status + uploaded file name


📂 Project Structure
trainstatuslogs/
│
├── mobilenet.py           # MobileNet API server
├── yolo.py                # YOLOv5 API server
│
├── uploaded_datasets/     # Saved ZIP uploads and extracted data
├── training_logs.log      # Shared training log file
│
└── requirements.txt       # Dependencies