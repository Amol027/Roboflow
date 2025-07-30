from flair.data import Sentence
from flair.models import SequenceTagger
from io import StringIO
import csv
import json
from models import NERModelTraining
from datetime import datetime

tagger = SequenceTagger.load("ner")

def process_flair(text: str, content: bytes, db, model_name: str):
    sentence = Sentence(text)
    tagger.predict(sentence)
    entities = [(ent.text, ent.tag) for ent in sentence.get_spans("ner")]
    return write_csv_and_record("Flair", text, content, entities, db, model_name)

def write_csv_and_record(model_used, text, content, entities, db, model_path):
    output_buffer = StringIO()
    writer = csv.writer(output_buffer)
    writer.writerow(["Entity Text", "Label"])
    for ent_text, label in entities:
        writer.writerow([ent_text, label])
    csv_bytes = output_buffer.getvalue().encode("utf-8")
    output_buffer.close()

    db_record = NERModelTraining(
        project_name="",
        task_name="",
        model_name=model_used,
        input_text=text,
        input_file=content,
        entities=json.dumps([{"text": e[0], "label": e[1]} for e in entities]),
        csv_data=csv_bytes,
        num_entities=len(entities),
        timestamp=datetime.utcnow(),
        status="Completed",
        model_path=model_path
    )
    db.add(db_record)
    db.commit()

    return {
        "message": "Entities extracted and saved.",
        "entities": [{"text": ent[0], "label": ent[1]} for ent in entities],
        "id": db_record.id
    }
