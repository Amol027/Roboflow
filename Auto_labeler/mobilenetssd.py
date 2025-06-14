from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torchvision
import torchvision.transforms as T
import cv2
import os
import pandas as pd
import logging
from PIL import Image
from typing import List
import uvicorn

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
)
logger = logging.getLogger(__name__)

# COCO labels
COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'N/A', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'N/A', 'backpack', 'umbrella', 'N/A',
    'N/A', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
    'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
    'surfboard', 'tennis racket', 'bottle', 'N/A', 'wine glass', 'cup', 'fork',
    'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
    'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'N/A', 'dining table', 'N/A', 'N/A', 'toilet', 'N/A',
    'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave',
    'oven', 'toaster', 'sink', 'refrigerator', 'N/A', 'book', 'clock', 'vase',
    'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

# Pydantic request model
class LabelRequest(BaseModel):
    image_folder: str
    output_folder: str

# AutoLabeler with RetinaNet
class AutoLabeler:
    def __init__(self, conf_threshold=0.25):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = torchvision.models.detection.retinanet_resnet50_fpn(pretrained=True)
        self.model.eval().to(self.device)
        self.conf_threshold = conf_threshold
        self.transform = T.Compose([
            T.ToTensor()
        ])

    def label_images(self, image_folder: str, output_folder: str):
        if not os.path.exists(image_folder):
            raise FileNotFoundError(f"Image folder not found: {image_folder}")
        if not os.path.exists(output_folder):
            raise FileNotFoundError(f"Output folder not found: {output_folder}")

        labeled_img_dir = os.path.join(output_folder, "labelled_images")
        os.makedirs(labeled_img_dir, exist_ok=True)

        output_data = []

        for image_name in os.listdir(image_folder):
            if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(image_folder, image_name)
                original_image = cv2.imread(image_path)
                if original_image is None:
                    logger.warning(f"Failed to read image: {image_path}, skipping.")
                    continue

                pil_img = Image.open(image_path).convert("RGB")
                input_tensor = self.transform(pil_img).unsqueeze(0).to(self.device)
                with torch.no_grad():
                    preds = self.model(input_tensor)[0]

                for idx in range(len(preds["boxes"])):
                    score = preds["scores"][idx].item()
                    if score < self.conf_threshold:
                        continue

                    label_id = preds["labels"][idx].item()
                    if label_id >= len(COCO_INSTANCE_CATEGORY_NAMES):
                        continue  # Skip unknown labels

                    box = preds["boxes"][idx].tolist()
                    label = COCO_INSTANCE_CATEGORY_NAMES[label_id]
                    xmin, ymin, xmax, ymax = map(int, box)

                    output_data.append({
                        'Image': image_name,
                        'Label': label,
                        'Confidence': round(score, 3),
                        'Xmin': xmin,
                        'Ymin': ymin,
                        'Xmax': xmax,
                        'Ymax': ymax
                    })

                    # Draw bounding box and label
                    cv2.rectangle(original_image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                    text = f'{label}: {score:.2f}'
                    cv2.putText(original_image, text, (xmin, max(20, ymin - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1)

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
def root():
    return {"message": "Use POST /auto-label to label images using RetinaNet."}

@app.post("/auto-label")
def label_images(req: LabelRequest):
    try:
        return labeler.label_images(req.image_folder, req.output_folder)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Labeling failed")
        raise HTTPException(status_code=500, detail="Internal server error")

# Entry point
if __name__ == "__main__":
    uvicorn.run("mobilenetssd:app", host="127.0.0.1", port=8004, reload=True)
