# Named Entity Recognition (NER) API

This project provides a FastAPI-based Named Entity Recognition (NER) service using multiple models:  
- **spaCy** (`en_core_web_sm`)  
- **Flair** (`ner-fast` tagger)  

Both services support text input from plain `.txt`, `.csv`, or `.json` files and output named entities into CSV format.  
Ideal for extracting structured information from unstructured text efficiently.

---

## 🔧 How to Run the Project

### 1. Install Requirements

```bash
pip install -r requirements.txt

Also download the spaCy model:

python -m spacy download en_core_web_sm
2. Start the FastAPI Servers
▶ spaCy-based NER API (Port 8000)

python spacy_app.py
▶ Flair-based NER API (Port 8001)

python flair_app.py
🌐 Access the Apps
spaCy Swagger Docs: http://127.0.0.1:8000/docs

Flair Swagger Docs: http://127.0.0.1:8001/docs

🚀 Using the /ner/extract Endpoint
Click “Try it out”

Upload your file (.txt, .csv, or .json)

Click Execute

The output CSV will be saved automatically to:

output/ner_output.csv
📁 Project Structure
plaintext
Copy
Edit
├── flair_app.py         # FastAPI app using Flair
├── spacy_app.py         # FastAPI app using spaCy
├── requirements.txt     # Project dependencies
├── output/
│   └── ner_output.csv   # Generated results
└── README.md