import os
import urllib.request
import tarfile

os.makedirs("models", exist_ok=True)

# 1. Download and extract model weights
model_url = "http://download.tensorflow.org/models/object_detection/ssd_mobilenet_v3_large_coco_2020_01_14.tar.gz"
print("Downloading SSD model...")
tar_path = "models/ssd_model.tar.gz"
urllib.request.urlretrieve(model_url, tar_path)
with tarfile.open(tar_path) as tar:
    tar.extractall(path="models")

# Move .pb file to root of models/
os.replace(
    "models/ssd_mobilenet_v3_large_coco_2020_01_14/frozen_inference_graph.pb",
    "models/frozen_inference_graph.pb"
)

# 2. Download pbtxt from a reliable source
print("Downloading .pbtxt config...")
pbtxt_url = "https://raw.githubusercontent.com/ankityddv/ObjectDetector-OpenCV/main/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
urllib.request.urlretrieve(pbtxt_url, "models/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt")

# 3. Download COCO class names
print("Downloading COCO class names...")
names_url = "https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names"
urllib.request.urlretrieve(names_url, "models/coco.names")

print("✅ Files downloaded to 'models/'!")
