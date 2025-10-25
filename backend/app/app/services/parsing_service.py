from app.models.parse_models import ParsedDocument
import google.generativeai as genai
import os

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

async def parse_document(text: str) -> dict:
    # Use Gemini to parse the document
    prompt = f"""
    Please extract the following information from this document text:
    - Name
    - Platform (e.g., Fiverr, Upwork)
    - Income estimate
    - Date range
    
    Document text:
    {text}
    """
    
    response = model.generate_content(prompt)
    # TODO: Process the response to extract structured data
    
    # For now, using example data
    parsed = ParsedDocument(
        name="John Smith",
        platform="Fiverr",
        income_estimate="$1200/month",
        date_range="Oct 2025"
    )
    return parsed.dict()