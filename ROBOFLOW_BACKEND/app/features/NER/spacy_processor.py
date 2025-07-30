import spacy
import subprocess
from flair_processor import write_csv_and_record

MODEL_NAME = "en_core_web_sm"

def ensure_spacy_model():
    try:
        return spacy.load(MODEL_NAME)
    except OSError:
        subprocess.run(["python", "-m", "spacy", "download", MODEL_NAME], check=True)
        return spacy.load(MODEL_NAME)

nlp = ensure_spacy_model()

def process_spacy(text: str, content: bytes, db, model_name: str):
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return write_csv_and_record("spaCy", text, content, entities, db, model_name)
