import os
import shutil
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from loguru import logger
from ultralytics import YOLO
import uvicorn

class SplitRequest(BaseModel):
    input_folder: str
    output_folder: str

class MetricsRequest(BaseModel):
    iou_threshold: float = 0.5

class DatasetSplitterAPI:
    def __init__(self):
        self.app = FastAPI()
        self.model_name = "yolov9s"
        self.model = None
        self.input_dir = ""
        self.output_dir = ""
        self.split_dirs = {}
        self.try_load_model()
        self.register_routes()

    def try_load_model(self):
        try:
            logger.info(f"Loading model: {self.model_name} (from hub)")
            self.model = YOLO(self.model_name)
            logger.success(f"Model {self.model_name} loaded successfully.")
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            raise HTTPException(status_code=500, detail="Failed to load model")

    def create_folders(self):
        self.split_dirs = {
            'train': {'images': os.path.join(self.output_dir, 'train', 'images'),
                      'labels': os.path.join(self.output_dir, 'train', 'labels')},
            'val': {'images': os.path.join(self.output_dir, 'val', 'images'),
                    'labels': os.path.join(self.output_dir, 'val', 'labels')},
            'test': {'images': os.path.join(self.output_dir, 'test', 'images'),
                     'labels': os.path.join(self.output_dir, 'test', 'labels')}
        }
        for split in self.split_dirs.values():
            os.makedirs(split['images'], exist_ok=True)
            os.makedirs(split['labels'], exist_ok=True)

    def split_files(self):
        images = [f for f in os.listdir(self.input_dir)
                  if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if not images:
            raise FileNotFoundError(f"No images found in {self.input_dir}")
        random.shuffle(images)
        total = len(images)
        train_split = int(0.7 * total)
        val_split = int(0.2 * total)
        return {
            'train': images[:train_split],
            'val': images[train_split:train_split + val_split],
            'test': images[train_split + val_split:]
        }

    def label_image(self, image_path, label_path):
        try:
            results = self.model.predict(source=image_path, save=False, verbose=False)
            boxes = results[0].boxes
            xywh = boxes.xywh.cpu().numpy()
            classes = boxes.cls.cpu().numpy().astype(int)
            with open(label_path, 'w') as f:
                for cls, box in zip(classes, xywh):
                    x, y, w, h = box
                    f.write(f"{cls} {x} {y} {w} {h}\n")
        except Exception as e:
            logger.error(f"Labeling failed for {image_path}: {e}")

    def copy_and_label(self, split_name, files):
        for file in files:
            try:
                src = os.path.join(self.input_dir, file)
                dst = os.path.join(self.split_dirs[split_name]['images'], file)
                lbl = os.path.join(self.split_dirs[split_name]['labels'], file.rsplit('.', 1)[0] + '.txt')
                shutil.copy2(src, dst)
                self.label_image(dst, lbl)
            except Exception as e:
                logger.error(f"Error processing {file}: {e}")

    def run_splitter(self, input_folder: str, output_folder: str):
        self.input_dir = input_folder
        self.output_dir = output_folder
        if not os.path.exists(self.input_dir):
            raise HTTPException(status_code=400, detail="Input folder not found")
        self.create_folders()
        splits = self.split_files()
        for split_name, files in splits.items():
            logger.info(f"Processing {split_name} set ({len(files)} files)...")
            self.copy_and_label(split_name, files)
        logger.success("Dataset splitting and labeling completed.")
        return {"status": "success", "model": self.model_name}

    def calculate_metrics(self, iou_thresh=0.5):
        test_img_dir = self.split_dirs['test']['images']
        test_label_dir = self.split_dirs['test']['labels']
        ground_truth_dir = self.input_dir.replace("images", "labels")
        tp = fp = fn = 0
        for img_file in os.listdir(test_img_dir):
            if not img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            base = img_file.rsplit('.', 1)[0]
            pred_boxes = self.load_boxes(os.path.join(test_label_dir, base + ".txt"))
            true_boxes = self.load_boxes(os.path.join(ground_truth_dir, base + ".txt"))
            matched = set()
            for t in true_boxes:
                found = False
                for i, p in enumerate(pred_boxes):
                    if i in matched: continue
                    if self.iou(t[1:], p[1:]) > iou_thresh and t[0] == p[0]:
                        tp += 1
                        matched.add(i)
                        found = True
                        break
                if not found: fn += 1
            fp += len(pred_boxes) - len(matched)
        prec = tp / (tp + fp) if tp + fp else 0
        rec = tp / (tp + fn) if tp + fn else 0
        logger.info(f"Precision: {prec:.4f}, Recall: {rec:.4f}")
        return {"precision": round(prec, 4), "recall": round(rec, 4), "TP": tp, "FP": fp, "FN": fn}

    @staticmethod
    def load_boxes(path):
        boxes = []
        if not os.path.exists(path): return boxes
        with open(path) as f:
            for line in f:
                cls, x, y, w, h = map(float, line.strip().split())
                boxes.append((int(cls), x, y, w, h))
        return boxes

    @staticmethod
    def iou(b1, b2):
        def corners(x, y, w, h):
            return x - w / 2, y - h / 2, x + w / 2, y + h / 2
        x1_min, y1_min, x1_max, y1_max = corners(*b1)
        x2_min, y2_min, x2_max, y2_max = corners(*b2)
        inter = max(0, min(x1_max, x2_max) - max(x1_min, x2_min)) * max(0, min(y1_max, y2_max) - max(y1_min, y2_min))
        union = (x1_max - x1_min) * (y1_max - y1_min) + (x2_max - x2_min) * (y2_max - y2_min) - inter
        return inter / union if union else 0

    def register_routes(self):
        @self.app.get("/")
        async def root():
            return {"message": f"{self.model_name} Dataset Splitter API", "endpoints": ["/split", "/metrics"]}
        @self.app.post("/split")
        async def split(req: SplitRequest):
            return self.run_splitter(req.input_folder, req.output_folder)
        @self.app.post("/metrics")
        async def metrics(req: MetricsRequest):
            return self.calculate_metrics(req.iou_threshold)

api = DatasetSplitterAPI()
app = api.app

if __name__ == "__main__":
    uvicorn.run("yolov9s_app:app", host="127.0.0.1", port=8001, reload=True)
