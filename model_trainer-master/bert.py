from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import torch
import os
import shutil
import logging
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification
from torch.optim import AdamW  # <-- Fixed here
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
import uvicorn

# FastAPI app
app = FastAPI()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directory to save uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Custom Dataset for BERT
class TextDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self): return len(self.texts)

    def __getitem__(self, idx):
        inputs = self.tokenizer(
            self.texts[idx],
            padding='max_length',
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt"
        )
        item = {key: val.squeeze() for key, val in inputs.items()}
        item['labels'] = torch.tensor(self.labels[idx], dtype=torch.long)
        return item

# BERT Training Function
def train_bert_model(train_texts, train_labels, test_texts, test_labels):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=len(set(train_labels)))
    model.to(device)

    train_dataset = TextDataset(train_texts.tolist(), train_labels.tolist(), tokenizer)
    test_dataset = TextDataset(test_texts.tolist(), test_labels.tolist(), tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=16)

    optimizer = AdamW(model.parameters(), lr=2e-5)

    model.train()
    for epoch in range(3):  # fixed epoch for simplicity
        for batch in train_loader:
            inputs = {k: v.to(device) for k, v in batch.items()}
            outputs = model(**inputs)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

    # Evaluation
    model.eval()
    preds, targets = [], []
    with torch.no_grad():
        for batch in test_loader:
            inputs = {k: v.to(device) for k, v in batch.items()}
            outputs = model(**inputs)
            logits = outputs.logits
            preds += torch.argmax(logits, dim=1).cpu().tolist()
            targets += batch['labels'].cpu().tolist()

    return {
        "accuracy": accuracy_score(targets, preds),
        "precision": precision_score(targets, preds, average='weighted'),
        "recall": recall_score(targets, preds, average='weighted')
    }

# Endpoint: Train BERT Model
@app.post("/train/bert")
async def train_bert(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        logger.info(f"Saved file to: {file_path}")

        # Load dataset
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file.filename.endswith('.json'):
            df = pd.read_json(file_path)
        else:
            raise ValueError("Unsupported file format. Use CSV or JSON.")

        if 'text' not in df.columns or 'label' not in df.columns:
            raise ValueError("Dataset must contain 'text' and 'label' columns.")

        train_texts, test_texts, train_labels, test_labels = train_test_split(
            df['text'], df['label'], test_size=0.2, random_state=42
        )

        metrics = train_bert_model(train_texts, train_labels, test_texts, test_labels)

        return JSONResponse(content={"status": "success", "metrics": metrics})
    
    except Exception as e:
        logger.exception("Training failed.")
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("bert:app", host="127.0.0.1", port=8004, reload=True)