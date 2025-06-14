from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import cv2
from pathlib import Path
import logging
import uvicorn

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# Request model
class PoseLabelRequest(BaseModel):
    image_folder: str
    output_folder: str

# MoveNet Model Loader
class MoveNetPoseLabeler:
    def __init__(self):
        logger.info("📦 Loading MoveNet Lightning model...")
        self.model = hub.load("https://tfhub.dev/google/movenet/singlepose/lightning/4")
        self.module = self.model.signatures['serving_default']
        self.input_size = 192
        self.supported_exts = ['.jpg', '.jpeg', '.png']

    def _preprocess(self, image):
        img = tf.image.resize_with_pad(tf.expand_dims(image, axis=0), self.input_size, self.input_size)
        return tf.cast(img, dtype=tf.int32)

    def _draw_keypoints_and_edges(self, image, keypoints, confidence_threshold=0.3):
        height, width, _ = image.shape
        keypoints = keypoints[0, 0, :, :]

        # Draw keypoints
        for y, x, confidence in keypoints:
            if confidence > confidence_threshold:
                cv2.circle(image, (int(x * width), int(y * height)), 4, (0, 255, 0), -1)

        # Skeleton connections
        skeleton = [
            (0, 1), (1, 2), (2, 3), (3, 4),
            (0, 5), (5, 6), (6, 7), (7, 8),
            (9, 10),
            (5, 11), (6, 12),
            (11, 12), (11, 13), (13, 15),
            (12, 14), (14, 16)
        ]

        for a, b in skeleton:
            y1, x1, c1 = keypoints[a]
            y2, x2, c2 = keypoints[b]
            if c1 > confidence_threshold and c2 > confidence_threshold:
                pt1 = (int(x1 * width), int(y1 * height))
                pt2 = (int(x2 * width), int(y2 * height))
                cv2.line(image, pt1, pt2, (255, 0, 0), 2)

        return image

    def label_images(self, image_folder: str, output_folder: str):
        input_dir = Path(image_folder)
        output_dir = Path(output_folder)
        output_dir.mkdir(parents=True, exist_ok=True)

        if not input_dir.exists():
            raise FileNotFoundError(f"Image folder not found: {image_folder}")

        results = []
        total = 0
        with_pose = 0

        for img_file in input_dir.glob("*"):
            if img_file.suffix.lower() not in self.supported_exts:
                continue

            img = cv2.imread(str(img_file))
            if img is None:
                logger.warning(f"❌ Failed to read: {img_file}")
                continue

            total += 1
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            input_tensor = self._preprocess(img_rgb)
            output = self.module(input_tensor)
            keypoints = output['output_0'].numpy()

            conf = keypoints[0, 0, :, 2]
            if np.mean(conf) > 0.2:
                with_pose += 1
                img = self._draw_keypoints_and_edges(img, keypoints)

            save_path = output_dir / img_file.name
            cv2.imwrite(str(save_path), img)
            logger.info(f"✅ Saved: {save_path}")
            results.append(str(save_path))

        return {
            "message": "MoveNet Pose labeling completed",
            "total_images": total,
            "images_with_pose": with_pose,
            "accuracy (%)": round((with_pose / total) * 100, 2) if total else 0.0,
            "output_images": results
        }

# FastAPI app
app = FastAPI()
pose_labeler = MoveNetPoseLabeler()

@app.get("/")
async def home():
    return {"message": "Welcome to the MoveNet Pose Labeler API on port 8003."}

@app.post("/pose-label")
async def label_pose(req: PoseLabelRequest):
    try:
        return pose_labeler.label_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run on port 8003
if __name__ == "__main__":
    uvicorn.run("movenet:app", host="127.0.0.1", port=8002, reload=True)
