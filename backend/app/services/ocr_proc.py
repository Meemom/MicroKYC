import pytesseract
from PIL import Image
import os

# Point to your Tesseract installation
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def process_image(image_path: str) -> str:
    """Extract text from an image file using Tesseract OCR."""
    text = pytesseract.image_to_string(Image.open(image_path))
    return text
