import pytesseract
from pytesseract import Output
from PIL import Image
from .ocr_models import OCRResult  # your Pydantic model

# Set Tesseract path explicitly
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\vriti\Desktop\Tesseract\tesseract.exe"

def extract_text_from_image(file_path: str) -> OCRResult:
    image = Image.open(file_path)
    data = pytesseract.image_to_data(image, output_type=Output.DICT)
    raw_text = " ".join(data['text'])
    confidences = [float(c) for c in data['conf'] if c.isdigit()]
    avg_confidence = sum(confidences) / len(confidences) if confidences else None

    return OCRResult(
        raw_text=raw_text,
        file_name=file_path,
        num_lines=len(data['text']),
        confidence=avg_confidence
    )
