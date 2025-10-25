import pytesseract
from fastapi import UploadFile
from models.ocr_models import OCRResult


async def extract_text(file: UploadFile) -> str:
    # Save uploaded file temporarily
    contents = await file.read()
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(contents)


    # OCR extraction
    text = pytesseract.image_to_string(f"/tmp/{file.filename}")


    return text