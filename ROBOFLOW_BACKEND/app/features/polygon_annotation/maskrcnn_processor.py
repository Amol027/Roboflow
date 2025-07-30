import numpy as np, cv2
import torch
from torchvision.models.detection import maskrcnn_resnet50_fpn
from torchvision.transforms import functional as F

class MaskRCNNSegmenter:
    def __init__(self, confidence_threshold=0.5):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = maskrcnn_resnet50_fpn(pretrained=True).to(self.device).eval()
        self.confidence_threshold = confidence_threshold
        self.supported_exts = ['.jpg', '.jpeg', '.png']

    def segment_image(self, img_bytes: bytes, img_name: str):
        img_np = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError(f"Invalid image: {img_name}")

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        tensor = F.to_tensor(rgb).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)[0]

        masks = outputs['masks'].cpu().numpy()
        scores = outputs['scores'].cpu().numpy()
        obj_count = 0

        for i, score in enumerate(scores):
            if score < self.confidence_threshold:
                continue
            mask = (masks[i, 0] > 0.5).astype(np.uint8) * 255
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                cv2.drawContours(img, [cnt], -1, (0, 255, 0), 2)
            obj_count += 1

        _, enc = cv2.imencode(".jpg", img)
        return enc.tobytes(), obj_count
