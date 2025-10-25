from models.parse_models import ParsedDocument


async def parse_document(text: str) -> dict:
    # Placeholder LLM parsing logic
    # TO DO: replace with Gemini API call

    # Example mock parsing logic
    parsed = ParsedDocument(
    name="John Smith",
    platform="Fiverr",
    income_estimate="$1200/month",
    date_range="Oct 2025"
    )
    return parsed.dict()