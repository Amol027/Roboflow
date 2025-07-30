import tempfile, cv2

class SSDVideoDetector:
    def __init__(self, weights_path, config_path, labels):
        self.labels = labels
        self.net = cv2.dnn_DetectionModel(weights_path, config_path)
        self.net.setInputSize(320, 320)
        self.net.setInputScale(1.0 / 127.5)
        self.net.setInputMean((127.5, 127.5, 127.5))
        self.net.setInputSwapRB(True)

    def process(self, video_bytes: bytes):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_in:
            temp_in.write(video_bytes)
            input_path = temp_in.name

        cap = cv2.VideoCapture(input_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 20
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        output_path = input_path.replace(".mp4", "_ssd_out.mp4")
        out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            class_ids, confs, boxes = self.net.detect(frame, confThreshold=0.5)
            for class_id, confidence, box in zip(class_ids.flatten(), confs.flatten(), boxes):
                label = f"{self.labels[class_id]}: {confidence:.2f}"
                x, y, w, h = box
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            out.write(frame)
        cap.release()
        out.release()

        with open(output_path, "rb") as f:
            return f.read(), total_frames, {i: name for i, name in enumerate(self.labels)}
