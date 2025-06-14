from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mediapipe as mp
import cv2
import os
from pathlib import Path
import logging
import uvicorn

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# FastAPI app
app = FastAPI()

# Request model
class PoseLabelRequest(BaseModel):
    image_folder: str
    output_folder: str

# MediaPipe setup
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose_estimator = mp_pose.Pose(static_image_mode=True)

@app.get("/")
async def root():
    return {"message": "Welcome to the MediaPipe Pose Labeler API. Use POST /pose-label to start."}

@app.post("/pose-label")
async def label_pose(req: PoseLabelRequest):
    input_dir = Path(req.image_folder)
    output_dir = Path(req.output_folder)

    if not input_dir.exists():
        raise HTTPException(status_code=404, detail=f"Input folder not found: {input_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    supported_exts = ['.jpg', '.jpeg', '.png', '.bmp']
    results_summary = []
    total_images = 0
    images_with_poses = 0

    for img_path in input_dir.glob("*"):
        if img_path.suffix.lower() not in supported_exts:
            continue

        img = cv2.imread(str(img_path))
        if img is None:
            logging.warning(f"❌ Failed to read image: {img_path}")
            continue

        total_images += 1
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        result = pose_estimator.process(img_rgb)

        if result.pose_landmarks:
            images_with_poses += 1
            mp_drawing.draw_landmarks(
                image=img,
                landmark_list=result.pose_landmarks,
                connections=mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
            )

        save_path = output_dir / img_path.name
        cv2.imwrite(str(save_path), img)
        logging.info(f"✅ Saved pose-labeled image: {save_path}")
        results_summary.append(str(save_path))

    return {
        "message": "Pose labeling completed using MediaPipe.",
        "output_folder": str(output_dir),
        "processed_images": results_summary,
        "success_rate (%)": round((images_with_poses / total_images) * 100, 2) if total_images else 0.0
    }

# Run on port 8001
if __name__ == "__main__":
    uvicorn.run("MediaPipe:app", host="127.0.0.1", port=8001, reload=True)
