from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import cv2
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Request model
class SegmentationRequest(BaseModel):
    image_folder: str
    output_folder: str

# Polygon segmentation logic
class PolygonSegmenter:
    def __init__(self, model_path: str, confidence_threshold=0.5):
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        self.supported_exts = ['.jpg', '.jpeg', '.png']

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

        for img_file in input_dir.glob("*"):
            if img_file.suffix.lower() not in self.supported_exts:
                continue

            img = cv2.imread(str(img_file))
            if img is None:
                logger.warning(f"❌ Could not read image: {img_file}")
                continue

            total_images += 1
            results = self.model.predict(img, conf=self.confidence_threshold, retina_masks=True, save=False)

            object_count = 0
            for result in results:
                masks = result.masks
                names = result.names
                boxes = result.boxes

                if masks is not None and len(masks.xy) > 0:
                    object_count += len(masks.xy)
                    for i, polygon in enumerate(masks.xy):
                        polygon_np = polygon.astype(int)
                        cv2.polylines(img, [polygon_np], isClosed=True, color=(0, 255, 0), thickness=2)

                        if boxes is not None and i < len(boxes.cls):
                            cls_id = int(boxes.cls[i])
                            label = names.get(cls_id, "unknown")
                            x, y = polygon_np[0]
                            cv2.putText(img, label, (x, y - 10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

            if object_count > 0:
                images_with_objects += 1
                total_detected_objects += object_count

            save_path = output_dir / f"annotated_{img_file.name}"
            cv2.imwrite(str(save_path), img)
            logger.info(f"✅ Saved annotated image: {save_path}")
            results_summary.append(str(save_path))

        training_accuracy = (images_with_objects / total_images * 100) if total_images else 0.0
        testing_accuracy = (total_detected_objects / total_images) if total_images else 0.0

        return {
            "message": "Segmentation and annotation completed successfully",
            "output_folder": str(output_dir),
            "processed_images": results_summary,
            "training_accuracy (%)": round(training_accuracy, 2),
            "testing_accuracy (avg objects/image)": round(testing_accuracy, 2)
        }

# FastAPI app
app = FastAPI()

@app.get("/")
async def home():
    return {
        "message": "Welcome to the Multi-Model YOLOv8 Segmentation API",
        "available_endpoints": [
            "/segment-yolov8n",
            "/segment-yolov8s",
            "/segment-yolov8m",
            "/segment-yolov8l",
            "/segment-yolov8x"
        ]
    }

# --- YOLOv8 Nano ---
@app.post("/segment-yolov8n")
async def segment_with_yolov8n(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter("yolov8n-seg.pt")
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# --- YOLOv8 Small ---
@app.post("/segment-yolov8s")
async def segment_with_yolov8s(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter("yolov8s-seg.pt")
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# --- YOLOv8 Medium ---
@app.post("/segment-yolov8m")
async def segment_with_yolov8m(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter("yolov8m-seg.pt")
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# --- YOLOv8 Large ---
@app.post("/segment-yolov8l")
async def segment_with_yolov8l(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter("yolov8l-seg.pt")
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# --- YOLOv8 X-Large ---
@app.post("/segment-yolov8x")
async def segment_with_yolov8x(req: SegmentationRequest):
    try:
        segmenter = PolygonSegmenter("yolov8x-seg.pt")
        return segmenter.segment_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("yolov:app", host="127.0.0.1", port=8000, reload=True)