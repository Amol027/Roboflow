# Named Entity Recognition (NER) API with PostgreSQL
This project is a backend system for Named Entity Recognition (NER) using spaCy and Flair models. It extracts entities from uploaded text files and stores the results—along with metadata and CSV exports—into a PostgreSQL database. Built with FastAPI, it provides a RESTful API with Swagger UI for easy interaction.

This project provides a FastAPI-based backend for Named Entity Recognition (NER) using two NLP models:

- `spaCy` (via `spacy_app.py`)
- `Flair` (via `flair_app.py`)

Extracted entities and metadata are saved into a PostgreSQL database.

---

## 🔧 Features

- Accepts file uploads and metadata (JSON-style) for entity extraction
- Supports both `spaCy` and `Flair` NER models
- Stores input file, raw text, extracted entities, and CSV output in PostgreSQL
- Swagger UI for testing endpoints

---
## Create .env file
Create a .env file with the following:
DATABASE_URL=postgresql://postgres:<your_password>@localhost:port_no./database_name

### Install Dependencies
pip install -r requirements.txt

### How to run:

1.Initialize the Database
python init_db.py


🚀 Running the Apps

start spacy:
python spacy_app.py

start flair:
python ner_flair.py

Access API Docs at:

http://127.0.0.1:8000/docs — spaCy

http://127.0.0.1:8001/docs — Flair

📬 API Endpoints
POST /extract
Accepts project_name, task_name, and model_path as JSON-style form fields

Accepts file upload (.txt)

Returns: Extracted entities and confirmation message

GET /get-csv?id=<record_id>
Returns stored CSV file for the given record ID

🐘 PostgreSQL Table
Table: ner_model_training

Stores:

project metadata

input file & extracted text

list of entities

CSV of results

status, timestamp, and model info

📌 Notes
Input file must be plain .txt

spaCy model auto-downloads if not present

All files and data are stored in PostgreSQL using SQLAlchemy ORM


### ✅ Output Overview:
After you send a POST request to /extract with:

JSON input (project name, task name, model path)

A text file (.txt) containing any text

The API:

Extracts named entities (like names, organizations, dates) using either spaCy or Flair.

Stores the following in PostgreSQL:

Input metadata (project name, etc.)

Original file (binary format)

Extracted entities (in JSON format)

CSV output (binary)

Returns a JSON response showing the extracted entities.

📤 API Output Example (JSON response):
json

{
  "message": "Entities extracted and saved to PostgreSQL.",
  "entities": [
    {
      "text": "Apple",
      "label": "ORG"
    },
    {
      "text": "Tim Cook",
      "label": "PERSON"
    },
    {
      "text": "2023",
      "label": "DATE"
    }
  ]
}
📥 CSV Output Stored in DB:
The same entities are stored in the database as a .csv format (retrievable via /get-csv?id=<record_id>):

Entity Text,Label
Apple,ORG
Tim Cook,PERSON
2023,DATE
🗃️ Database Record (ner_model_training table):
Each API call creates one row in the ner_model_training table:

Field	Example
project_name	"CompanyNER"
task_name	"EntityExtraction"
model_name	"spaCy"
input_text	"Apple CEO Tim Cook spoke in 2023."
input_file	[Binary content of uploaded text file]
entities	[{"text": "Apple", "label": "ORG"}, ...]
csv_data	[Binary of the CSV shown above]
num_entities	3
timestamp	2025-06-25 10:35:22
status	"Completed"
model_path	"path/to/spacy"

