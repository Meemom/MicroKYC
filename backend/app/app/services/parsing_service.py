import os 
from google import genai
from dotenv import load_dotenv
from models.parse_models import ParsedDocument

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-1.5-pro",
    contents="Hello from GigPass!"
)

print(response.text)


async def parse_document(text: str) -> dict:
    """
    Uses Gemini API to parse and extract structured financial data
    from the uploaded document text (e.g. pay stubs, W-2s, etc.).
    """
    prompt = f"""
    You are a financial document parser AI. Analyze the text below and extract key details.

    Text:
    {text}

    Return a JSON object with the following fields:
    - name: the individual's name
    - platform: the gig or employment platform (e.g., Uber, DoorDash, Fiverr, etc.)
    - income_estimate: total income in the document (if multiple, return total)
    - date_range: time period covered (e.g., "Sep 2025", "Q3 2025", etc.)
    - payment_frequency: weekly, bi-weekly, monthly, etc.
    - employer_or_client: the company or client name if visible
    """

    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt
    )

    # Gemini might return natural language text, so we’ll try to extract the JSON cleanly
    try:
        import json
        # Try to find JSON-like structure in the response
        start = response.text.find("{")
        end = response.text.rfind("}") + 1
        json_str = response.text[start:end]
        parsed_json = json.loads(json_str)
    except Exception as e:
        print("⚠️ Parsing failed:", e)
        # Fallback: return mock data if Gemini response is not valid JSON
        parsed_json = {
            "name": "Unknown",
            "platform": "Unknown",
            "income_estimate": "N/A",
            "date_range": "N/A",
            "payment_frequency": "N/A",
            "employer_or_client": "N/A"
        }

    # Wrap parsed JSON in Pydantic model (ParsedDocument)
    parsed = ParsedDocument(**parsed_json)
    return parsed.dict()