# flair_app.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from flair.models import SequenceTagger
from flair.data import Sentence
import csv, os, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Flair model
try:
    tagger = SequenceTagger.load("ner-fast")
    logger.info("Flair model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading Flair model: {e}")
    raise

app = FastAPI(title="Flair NER API")
OUTPUT_CSV = "output/ner_output_flair.csv"

@app.post("/extract")
async def extract_entities(file: UploadFile = File(...)):
    try:
        text = (await file.read()).decode("utf-8")
        logger.info(f"Received text: {text}")
        sentence = Sentence(text)
        tagger.predict(sentence)
        entities = [(entity.text, entity.tag) for entity in sentence.get_spans('ner')]

        if not entities:
            return JSONResponse(content={"message": "No entities found."}, status_code=200)

        os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
        with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Entity Text", "Label"])
            writer.writerows(entities)

        return {
            "message": "Entities extracted and saved to CSV.",
            "entities": [{"text": ent[0], "label": ent[1]} for ent in entities],
            "csv_path": OUTPUT_CSV
        }

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ner_flair:app", host="127.0.0.1", port=8001, reload=True)
