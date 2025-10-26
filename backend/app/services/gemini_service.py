from google.generativeai import Client
from PyPDF2 import PdfReader
from PIL import Image
import pytesseract  # Optional, only if you want local OCR fallback

# Initialize Gemini client (replace with your actual API key)
client = Client(api_key="YOUR_GEMINI_API_KEY")

def process_file(file_path: str, file_type: str = "text") -> str:
    """
    Process a file via Gemini 2.5 Pro API.
    Supports 'pdf', 'image', and plain 'text' files.
    Returns extracted or generated content.
    """
    if file_type == "pdf":
        # Extract text from PDF locally
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        if not text.strip():
            return "No text found in PDF."
        # Optionally, send text to Gemini to summarize or analyze
        response = client.chat_completions.create(
            model="gemini-2.5",
            messages=[
                {"role": "user", "content": f"Please summarize the following text:\n{text}"}
            ],
        )
        return response.choices[0].message.content

    elif file_type == "image":
        # Use local OCR to extract text from image
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        if not text.strip():
            return "No text found in image."
        # Optionally, send text to Gemini for processing
        response = client.chat_completions.create(
            model="gemini-2.5",
            messages=[
                {"role": "user", "content": f"Please summarize the following text extracted from an image:\n{text}"}
            ],
        )
        return response.choices[0].message.content

    else:  # plain text
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        response = client.chat_completions.create(
            model="gemini-2.5",
            messages=[{"role": "user", "content": f"Please analyze this text:\n{text}"}],
        )
        return response.choices[0].message.content
