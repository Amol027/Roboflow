from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
import logging
from fastapi.responses import StreamingResponse
from io import BytesIO
from database import SessionLocal
from models import NERModelTraining
from spacy_processor import process_spacy
from flair_processor import process_flair

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NER Multi-Model API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/extract")
async def extract_entities(
    model_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        text = content.decode("utf-8")
        logger.info(f"Received model: {model_name}, file length: {len(text)}")

        if model_name.lower() == "spacy":
            return process_spacy(text, content, db, model_name)
        elif model_name.lower() == "flair":
            return process_flair(text, content, db, model_name)
        else:
            raise HTTPException(status_code=400, detail="Invalid model name. Use 'spacy' or 'flair'.")

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/get-csv")
def get_csv(id: int, db: Session = Depends(get_db)):
    record = db.query(NERModelTraining).filter_by(id=id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    filename = f"ner_output_{id}.csv"
    return StreamingResponse(
        BytesIO(record.csv_data),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )