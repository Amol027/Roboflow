from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import spacy
import csv
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("spaCy model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading spaCy model: {e}")
    raise

# FastAPI instance
app = FastAPI(title="spaCy NER API")

# Output directory and file path
OUTPUT_DIR = "output"
OUTPUT_CSV = os.path.join(OUTPUT_DIR, "ner_output_spacy.csv")

@app.post("/extract")
async def extract_entities(file: UploadFile = File(...)):
    try:
        # Read and decode file
        content = await file.read()
        text = content.decode("utf-8")
        logger.info(f"Received text: {text}")

        # Run NER
        doc = nlp(text)
        entities = [(ent.text, ent.label_) for ent in doc.ents]

        if not entities:
            return JSONResponse(content={"message": "No entities found."}, status_code=200)

        # Create output directory if it doesn't exist
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Write results to CSV
        with open(OUTPUT_CSV, mode='w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["Entity Text", "Label"])
            for ent_text, label in entities:
                writer.writerow([ent_text, label])

        logger.info(f"Saved entities to CSV at {OUTPUT_CSV}")

        return {
            "message": "Entities extracted and saved to CSV.",
            "entities": [{"text": ent[0], "label": ent[1]} for ent in entities],
            "csv_path": OUTPUT_CSV
        }

    except Exception as e:
        logger.error(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Run with: uvicorn spacy_app:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("spacy_app:app", host="127.0.0.1", port=8000, reload=True)
