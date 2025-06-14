from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import torch
import cv2
import logging
from pathlib import Path
import uvicorn

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Request model for POST
class PoseLabelRequest(BaseModel):
    image_folder: str
    output_folder: str

# Pose Labeler class
class PoseLabeler:
    def __init__(self, model_name: str = "yolov8n-pose.pt", confidence_threshold=0.1):
        self.model = YOLO(model_name)
        self.confidence_threshold = confidence_threshold
        self.skeleton = [
            (5, 7), (7, 9),     # Left arm
            (6, 8), (8, 10),    # Right arm
            (5, 6),             # Shoulders
            (11, 13), (13, 15), # Left leg
            (12, 14), (14, 16), # Right leg
            (11, 12),           # Hips
            (5, 11), (6, 12)    # Torso
        ]
        self.supported_exts = ['.jpg', '.jpeg', '.png', '.bmp']

    def label_poses(self, image_folder: str, output_folder: str):
        input_dir = Path(image_folder)
        output_dir = Path(output_folder)

        if not input_dir.exists():
            raise FileNotFoundError(f"Image folder not found: {image_folder}")

        output_dir.mkdir(parents=True, exist_ok=True)
        results_summary = []
        total_images = 0
        images_with_poses = 0
        total_poses = 0

        for img_file in input_dir.glob("*"):
            if img_file.suffix.lower() not in self.supported_exts:
                continue

            img = cv2.imread(str(img_file))
            if img is None:
                logger.warning(f"❌ Failed to read {img_file}")
                continue

            total_images += 1
            results = self.model(img)
            img_draw = img.copy()
            pose_found = False

            for i, kps in enumerate(results[0].keypoints.data):
                confs = results[0].keypoints.conf[i]
                if torch.mean(confs) < self.confidence_threshold:
                    continue

                pose_found = True
                total_poses += 1
                keypoints = kps[:, :2].cpu().numpy()

                for x, y in keypoints:
                    if x > 0 and y > 0:
                        cv2.circle(img_draw, (int(x), int(y)), 3, (0, 255, 0), -1)

                for p1, p2 in self.skeleton:
                    x1, y1 = keypoints[p1]
                    x2, y2 = keypoints[p2]
                    if x1 > 0 and y1 > 0 and x2 > 0 and y2 > 0:
                        cv2.line(img_draw, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

            if pose_found:
                images_with_poses += 1

            save_path = output_dir / img_file.name
            cv2.imwrite(str(save_path), img_draw)
            logger.info(f"✅ Saved labeled image: {save_path}")
            results_summary.append(str(save_path))

        return {
            "message": "Pose labeling completed successfully",
            "output_folder": str(output_dir),
            "processed_images": results_summary,
            "training_accuracy (%)": round((images_with_poses / total_images) * 100, 2) if total_images else 0.0,
            "testing_accuracy (avg poses/image)": round(total_poses / total_images, 2) if total_images else 0.0
        }

# FastAPI app instance
app = FastAPI()
pose_labeler = PoseLabeler()

@app.get("/")
async def home():
    return {
        "message": "Welcome to the YOLOv8 Pose Labeler API",
        "usage": "Use POST /pose-label with JSON {image_folder, output_folder}"
    }

@app.post("/pose-label")
async def label_pose(req: PoseLabelRequest):
    try:
        result = pose_labeler.label_poses(req.image_folder, req.output_folder)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point
if __name__ == "__main__":
    uvicorn.run("yolov8n:app", host="127.0.0.1", port=8000, reload=True)
