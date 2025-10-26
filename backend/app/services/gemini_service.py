import google.generativeai as genai
from PyPDF2 import PdfReader
from PIL import Image
import os

# Initialize Gemini client
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def process_file(file_path: str, file_type: str = "text") -> str:
    """
    Process a file via Gemini 1.5 Flash API.
    Supports 'pdf', 'image', and plain 'text' files.
    Returns extracted or generated content.
    """
    model = genai.GenerativeModel('gemini-2.5-pro')
    if file_type == "pdf":
        # Extract text from PDF locally
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        if not text.strip():
            return "No text found in PDF."
        # Optionally, send text to Gemini to summarize or analyze
        response = model.generate_content(f"Please summarize the following text:\n{text}")
        return response.text

    elif file_type == "image":
        # Use local OCR to extract text from image
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        if not text.strip():
            return "No text found in image."
        # Optionally, send text to Gemini for processing
        response = model.generate_content(f"Please summarize the following text extracted from an image:\n{text}")
        return response.text

    else:  # plain text
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        response = model.generate_content(f"Please analyze this text:\n{text}")
        return response.text