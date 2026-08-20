# Roboflow-Inspired Computer Vision Platform

A full-stack computer-vision platform with a React dashboard and a FastAPI backend. The codebase includes project management, authentication, image classification, object detection, auto-labeling, keypoint workflows, polygon annotation, and named-entity-recognition experiments.

## Repository structure

```text
roboflow_frontend/   React + Vite dashboard
ROBOFLOW_BACKEND/    FastAPI API, PostgreSQL models, and ML workflows
```

## Tech stack

- Frontend: React, Vite, React Router
- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT authentication
- ML/CV: PyTorch, Torchvision, TensorFlow, Ultralytics, OpenCV, spaCy, Flair

## Run locally

### Backend

```powershell
cd ROBOFLOW_BACKEND
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Set the values in `.env` before starting the API. The application requires a PostgreSQL database and SMTP settings for email OTP flows.

### Frontend

```powershell
cd roboflow_frontend
npm ci
npm run dev
```

## Notes

The machine-learning packages are large and model workflows may download additional model weights at runtime. Some feature folders are experimental or standalone; the API entry point currently mounts authentication, project, and classification routes.

## Portfolio note

For a public demo, use non-production credentials and add screenshots or a short walkthrough of the dashboard and one complete ML workflow.
