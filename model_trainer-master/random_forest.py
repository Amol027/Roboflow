from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import os
import shutil
import logging
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score
import uvicorn
# Setup
app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/train/random-forest")
async def train_random_forest(file: UploadFile = File(...)):
    try:
        # Save uploaded CSV
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"File uploaded to {file_path}")

        # Load dataset
        df = pd.read_csv(file_path)
        if 'label' not in df.columns:
            return JSONResponse(status_code=400, content={
                "status": "error",
                "message": "CSV must contain a 'label' column."
            })

        # Encode categorical columns
        label_encoders = {}
        for col in df.columns:
            if df[col].dtype == 'object':
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                label_encoders[col] = le

        # Split data
        X = df.drop('label', axis=1)
        y = df['label']

        test_size = 0.3 if len(df) >= 10 else 0.5
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y if len(set(y)) > 1 else None
        )

        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Predictions
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)

        logger.info(f"Sample y_test: {y_test.tolist()}")
        logger.info(f"Sample y_pred: {y_pred.tolist()}")
        logger.info(f"Class distribution: {dict(pd.Series(y).value_counts())}")

        return JSONResponse(content={
            "status": "success",
            "metrics": {
                "accuracy": round(accuracy, 4),
                "precision": round(precision, 4),
                "recall": round(recall, 4)
            },
            "prediction_sample": y_pred[:5].tolist()
        })

    except Exception as e:
        logger.exception("Training failed.")
        return JSONResponse(status_code=500, content={
            "status": "error",
            "message": str(e)
        })
    

if __name__ == "__main__":
    uvicorn.run("random_forest:app", host="127.0.0.1", port=8003, reload=True)
