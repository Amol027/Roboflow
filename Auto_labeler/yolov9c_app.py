from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import cv2
import os
import pandas as pd
import logging
import uvicorn

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Pydantic request model
class LabelRequest(BaseModel):
    image_folder: str
    output_folder: str

# YOLOv9 Labeler class
class AutoLabeler:
    def __init__(self, confidence_threshold=0.25):
        self.model = YOLO("yolov9c.pt")  
        self.confidence_threshold = confidence_threshold

    def label_images(self, image_folder: str, output_folder: str):
        if not os.path.exists(image_folder):
            raise FileNotFoundError(f"Image folder not found: {image_folder}")
        if not os.path.exists(output_folder):
            raise FileNotFoundError(f"Output folder not found: {output_folder}")

        labeled_img_dir = os.path.join(output_folder, "labelled_images")
        if not os.path.exists(labeled_img_dir):
            raise FileNotFoundError(f"'labelled_images' folder not found in: {output_folder}")

        output_data = []

        for image_name in os.listdir(image_folder):
            if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(image_folder, image_name)
                original_image = cv2.imread(image_path)
                if original_image is None:
                    logger.warning(f"Failed to read image: {image_path}, skipping.")
                    continue

                height, width, _ = original_image.shape
                results = self.model(image_path, conf=self.confidence_threshold)

                for result in results:
                    boxes = result.boxes
                    for box in boxes:
                        class_id = int(box.cls)
                        label = self.model.names[class_id]
                        confidence = float(box.conf)
                        xyxy = box.xyxy[0].tolist()
                        xmin, ymin, xmax, ymax = map(int, xyxy)

                        if confidence >= self.confidence_threshold:
                            output_data.append({
                                'Image': image_name,
                                'Label': label,
                                'Confidence': round(confidence, 3),
                                'Xmin': xmin,
                                'Ymin': ymin,
                                'Xmax': xmax,
                                'Ymax': ymax
                            })

                            # Draw label on image
                            cv2.rectangle(original_image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 1)
                            text = f'{label}: {confidence:.2f}'
                            font = cv2.FONT_HERSHEY_SIMPLEX
                            font_scale = 1
                            thickness = 1
                            text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
                            text_x = min(xmin, width - text_size[0] - 5)
                            text_y = ymin - 6 if ymin - 6 > 6 else ymin + text_size[1] + 6
                            cv2.rectangle(original_image, (text_x, text_y - text_size[1] - 2),
                                          (text_x + text_size[0], text_y + 2), (0, 255, 0), -1)
                            cv2.putText(original_image, text, (text_x, text_y), font, font_scale,
                                        (0, 0, 0), thickness, cv2.LINE_AA)

                # Save labeled image
                output_img_path = os.path.join(labeled_img_dir, f"labeled_{image_name}")
                cv2.imwrite(output_img_path, original_image)

        # Save CSV
        csv_path = os.path.join(output_folder, "labeled_output_with_boxes.csv")
        pd.DataFrame(output_data).to_csv(csv_path, index=False)

        logger.info(f"Labeled images saved to: {labeled_img_dir}")
        logger.info(f"CSV saved to: {csv_path}")

        return {
            "message": "Labeling completed successfully",
            "labeled_images_folder": labeled_img_dir,
            "csv_file": csv_path
        }

# FastAPI app
app = FastAPI()
labeler = AutoLabeler()

@app.get("/")
async def home():
    return {"message": "Use POST /auto-label to label your images using YOLOv9c."}

@app.post("/auto-label")
async def label_images(req: LabelRequest):
    try:
        return labeler.label_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Labeling error")
        raise HTTPException(status_code=500, detail="Internal server error")

# Run the app using Python
if __name__ == "__main__":
    uvicorn.run("yolov9c_app:app", host="127.0.0.1", port=8002, reload=True)
