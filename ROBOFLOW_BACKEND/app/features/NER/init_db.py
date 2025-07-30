from sqlalchemy import inspect
from database import engine
from models import Base

inspector = inspect(engine)
if "ner_model_training" in inspector.get_table_names():
    print("✅ Table 'ner_model_training' already exists.")
else:
    Base.metadata.create_all(bind=engine)
    print("✅ Table 'ner_model_training' created.")
