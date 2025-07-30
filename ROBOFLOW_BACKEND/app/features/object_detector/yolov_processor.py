import tempfile, cv2
from ultralytics import YOLO

class YOLOVideoDetector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def process(self, video_bytes: bytes):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_in:
            temp_in.write(video_bytes)
            input_path = temp_in.name

        cap = cv2.VideoCapture(input_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 20
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        output_path = input_path.replace(".mp4", "_yolo_out.mp4")
        out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1
            results = self.model.predict(frame, verbose=False)[0]
            for box in results.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                label = f"{self.model.names[cls]}: {conf:.2f}"
                if conf > 0.5:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            out.write(frame)
        cap.release()
        out.release()

        with open(output_path, "rb") as f:
            return f.read(), frame_count, self.model.names
