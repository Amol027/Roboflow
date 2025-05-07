from ultralytics import YOLO
import cv2
import os
import pandas as pd

# Load better YOLOv8 model (YOLOv8m is more accurate than yolov8n)
model = YOLO('yolov8x.pt')

# Confidence threshold (ignore weak predictions)
CONFIDENCE_THRESHOLD = 0.25

# Folder containing images
image_folder = r'C:\Users\USER\Documents\Projects\auto_labeler\data\images'
output_folder = r'C:\Users\USER\Documents\Projects\auto_labeler\output\labeled_images'
output_data = []

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Process each image
for image_name in os.listdir(image_folder):
    if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
        image_path = os.path.join(image_folder, image_name)
        original_image = cv2.imread(image_path)
        height, width, _ = original_image.shape

        # Predict
        results = model(image_path, conf=CONFIDENCE_THRESHOLD)

        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls)
                label = model.names[class_id]
                confidence = float(box.conf)
                xyxy = box.xyxy[0].tolist()
                xmin, ymin, xmax, ymax = map(int, xyxy)

                # Filter low-confidence boxes (redundant if model(conf=...) is used)
                if confidence >= CONFIDENCE_THRESHOLD:
                    output_data.append({
                        'Image': image_name,
                        'Label': label,
                        'Confidence': round(confidence, 3),
                        'Xmin': xmin,
                        'Ymin': ymin,
                        'Xmax': xmax,
                        'Ymax': ymax
                    })

                    # Draw bounding box and label on the original image
                    color = (0, 255, 0)  # Green color for bounding box
                    thickness = 1
                    cv2.rectangle(original_image, (xmin, ymin), (xmax, ymax), color, thickness)

                    text = f'{label}: {confidence:.2f}'
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    font_scale = 1  # Further reduced font scale
                    font_thickness = 1  # Reduced font thickness
                    text_size = cv2.getTextSize(text, font, font_scale, font_thickness)[0]
                    text_x = xmin
                    text_y = ymin - 6 if ymin - 6 > 6 else ymin + text_size[1] + 6

                    # Ensure text doesn't go out of image bounds (width)
                    if text_x + text_size[0] > width:
                        text_x = width - text_size[0] - 5

                    cv2.rectangle(original_image, (text_x, text_y - text_size[1] - 2), (text_x + text_size[0], text_y + 2), color, -1)
                    cv2.putText(original_image, text, (text_x, text_y), font, font_scale, (0, 0, 0), font_thickness, cv2.LINE_AA)
        # Save the image with bounding boxes
        output_image_path = os.path.join(output_folder, f"labeled_{image_name}")
        cv2.imwrite(output_image_path, original_image)

# Save results to CSV
df = pd.DataFrame(output_data)
df.to_csv(r'C:\Users\USER\Documents\Projects\auto_labeler\output\labeled_output_with_boxes.csv', index=False)
print(f"Labeled images saved to {output_folder}")
print("Improved labels with bounding box coordinates saved to labeled_output_with_boxes.csv")