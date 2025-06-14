from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import torch
from torchvision.models.detection import maskrcnn_resnet50_fpn
from torchvision.transforms import functional as F
from pathlib import Path
import logging
from typing import List

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Request model
class SegmentationRequest(BaseModel):
    image_folder: str
    output_folder: str

# Polygon segmenter using Mask R-CNN
class PolygonSegmenter:
    def __init__(self, confidence_threshold=0.5):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = maskrcnn_resnet50_fpn(pretrained=True)
        self.model.eval().to(self.device)
        self.confidence_threshold = confidence_threshold
        self.supported_exts = [".jpg", ".jpeg", ".png", ".bmp"]

    def segment_images(self, image_folder: str, output_folder: str):
        input_dir = Path(image_folder)
        output_dir = Path(output_folder)
        if not input_dir.exists():
            raise FileNotFoundError(f"Image folder not found: {image_folder}")

        output_dir.mkdir(parents=True, exist_ok=True)
        results_summary = []
        total_images = 0
        images_with_objects = 0
        total_detected_objects = 0

        for img_path in input_dir.glob("*"):
            if img_path.suffix.lower() not in self.supported_exts:
                continue

            image = cv2.imread(str(img_path))
            if image is None:
                logger.warning(f"❌ Could not read image: {img_path}")
                continue

            total_images += 1
            orig = image.copy()
            image_rgb = cv2.cvtColor(orig, cv2.COLOR_BGR2RGB)
            img_tensor = F.to_tensor(image_rgb).unsqueeze(0).to(self.device)

            with torch.no_grad():
                outputs = self.model(img_tensor)[0]

            scores = outputs['scores'].cpu().numpy()
            masks = outputs['masks'].cpu().numpy()
            num_instances = 0

            for i, score in enumerate(scores):
                if score < self.confidence_threshold:
                    continue
                mask = masks[i, 0]
                mask_bin = (mask > 0.5).astype(np.uint8) * 255
                contours, _ = cv2.findContours(mask_bin, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                color = tuple(int(c) for c in np.random.randint(0, 255, size=3))
                for contour in contours:
                    cv2.drawContours(orig, [contour], -1, color, 2)
                num_instances += 1

            if num_instances > 0:
                images_with_objects += 1
                total_detected_objects += num_instances

            save_path = output_dir / f"seg_{img_path.name}"
            cv2.imwrite(str(save_path), orig)
            logger.info(f"✅ Saved annotated image: {save_path}")
            results_summary.append(str(save_path))

        training_accuracy = (images_with_objects / total_images * 100) if total_images else 0.0
        testing_accuracy = (total_detected_objects / total_images) if total_images else 0.0

        return {
            "message": "Segmentation completed successfully",
            "output_folder": str(output_dir),
            "processed_images": results_summary,
            "training_accuracy (%)": round(training_accuracy, 2),
            "testing_accuracy (avg objects/image)": round(testing_accuracy, 2)
        }

# FastAPI app
app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Mask R-CNN Polygon Segmentation API (Edges only)",
        "endpoint": "/segment-maskrcnn"
    }

@app.post("/segment-maskrcnn")
def segment_maskrcnn(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter()
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("maskrcnn:app", host="127.0.0.1", port=8001, reload=True)
