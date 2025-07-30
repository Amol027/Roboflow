from db import engine
from models import PolygonAnnotationRecord

if __name__ == "__main__":
    print("📦 Creating polygon_annotations table...")
    PolygonAnnotationRecord.metadata.create_all(bind=engine)
    print("✅ Table created successfully.")
