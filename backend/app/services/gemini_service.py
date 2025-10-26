import os
from google.generativeai import Client  # Gemini 2.5 Pro client
from PyPDF2 import PdfReader
from PIL import Image
import pytesseract

# Initialize Gemini 2.5 Pro client
client = Client(api_key=os.getenv("GOOGLE_API_KEY"))

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_text_from_image(file_path: str) -> str:
    """Extract text from an image using pytesseract."""
    return pytesseract.image_to_string(Image.open(file_path))

def extract_text_from_text_file(file_path: str) -> str:
    """Read plain text file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def process_file(file_path: str, file_type: str = "text") -> str:
    """
    Process a file and return Gemini-generated response.

    file_type: "text", "pdf", "image"
    """
    # Step 1: Extract text
    if file_type == "pdf":
        text = extract_text_from_pdf(file_path)
    elif file_type == "image":
        text = extract_text_from_image(file_path)
    else:
        text = extract_text_from_text_file(file_path)

    # Step 2: Call Gemini 2.5 Pro
    response = client.chat(
        model="gemini-2.5-pro",
        messages=[
            {"role": "user", "content": text}
        ],
        temperature=0.7,
        max_output_tokens=500
    )

    # Step 3: Return generated content
    return response["content"][0]["text"]  # adapt if Gemini response format changes