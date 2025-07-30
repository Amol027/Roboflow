import os
import shutil
import zipfile
from uuid import uuid4


def save_zip_file(uploaded_file, save_dir="temp_zips"):
    os.makedirs(save_dir, exist_ok=True)
    file_id = str(uuid4())
    path = os.path.join(save_dir, f"{file_id}.zip")
    with open(path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)
    return path


def extract_zip(zip_path, extract_to="extracted"):
    os.makedirs(extract_to, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    return extract_to


def zip_folder(folder_path, output_path):
    shutil.make_archive(output_path, 'zip', folder_path)
    return f"{output_path}.zip"
