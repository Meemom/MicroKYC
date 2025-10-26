# backend/app/services/parsing_service.py
import os
import re
import json
from typing import Dict, Any, Optional

from dotenv import load_dotenv
load_dotenv()

# Optional Gemini
_GEMINI_OK = False
try:
    import google.generativeai as genai
    API_KEY = os.getenv("GEMINI_API_KEY")
    if API_KEY:
        genai.configure(api_key=API_KEY)
        _GEMINI_OK = True
except Exception:
    _GEMINI_OK = False

MODEL_NAME = "models/gemini-2.5-pro"

def _regex_parse(text: str) -> Dict[str, Optional[str]]:
    """
    Extremely tolerant fallback for gig-style paystubs / statements.
    Extracts: name, platform, date_range, total, account_last4 (if present).
    """
    name = None
    platform = None
    date_range = None
    total = None
    last4 = None

    # Name: "Name: John Doe" or "Creator: Alex Morgan"
    m = re.search(r"(?:Name|Creator)\s*:\s*(.+)", text, re.IGNORECASE)
    if m:
        name = m.group(1).strip()

    # Platform: e.g. "Upwork Payout Statement" -> Upwork
    m = re.search(r"^([A-Za-z0-9 ]+?)\s+(?:Payout|Earnings|Paystub)\b", text, re.IGNORECASE | re.MULTILINE)
    if m:
        platform = m.group(1).strip()
    else:
        m2 = re.search(r"Platform\s*:\s*([A-Za-z0-9 \-_/]+)", text, re.IGNORECASE)
        platform = m2.group(1).strip() if m2 else None

    # Date range
    m = re.search(r"(?:Period|Date Range)\s*:\s*([^\n]+)", text, re.IGNORECASE)
    if m:
        date_range = m.group(1).strip()

    # Total: $11,750.00 / 11750
    m = re.search(r"Total\s*:\s*\$?([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
    if m:
        total = f"${m.group(1)}"

    # Last4
    m = re.search(r"Account ending in\s*(\d{4})", text, re.IGNORECASE)
    if m:
        last4 = m.group(1)

    # Payment frequency (very rough)
    payment_frequency = None
    if re.search(r"\bweekly\b", text, re.IGNORECASE):
        payment_frequency = "Weekly"
    elif re.search(r"\bbi[- ]?weekly\b", text, re.IGNORECASE):
        payment_frequency = "Biweekly"
    elif re.search(r"\bmonthly\b", text, re.IGNORECASE):
        payment_frequency = "Monthly"
    else:
        payment_frequency = "Irregular"

    return {
        "name": name or "Unknown",
        "platform": platform or "Unknown",
        "income_estimate": total or "Unknown",
        "date_range": date_range or "Unknown",
        "payment_frequency": payment_frequency or "Unknown",
        "employer_or_client": platform or "Unknown",
        "account_last4": last4 or "Unknown",
    }

async def parse_document(text: str) -> Dict[str, str]:
    """
    Try Gemini (if configured); otherwise fallback to regex.
    Returns **strings** for every field.
    """
    # Quick short-circuit via env if you want to force local behavior
    if os.getenv("PARSER_MOCK", "0") == "1" or not _GEMINI_OK:
        return _regex_parse(text)

    prompt = f"""
You are a financial document parser for gig worker paystubs & payout statements.
Extract the fields below as plain JSON (no extra text):

Text:
{text}

Return JSON with these exact string keys:
{{
  "name": "...",
  "platform": "...",
  "income_estimate": "...",
  "date_range": "...",
  "payment_frequency": "...",
  "employer_or_client": "...",
  "account_last4": "...."
}}
"""
    try:
        resp = genai.generate_content(model=MODEL_NAME, contents=prompt)
        raw = (getattr(resp, "text", "") or "").strip()

        # Extract first JSON block
        start = raw.find("{")
        end = raw.rfind("}") + 1
        parsed = json.loads(raw[start:end]) if start != -1 and end > start else {}
    except Exception:
        parsed = {}

    # Normalize + fill via regex if missing
    base = _regex_parse(text)
    base.update({k: (str(parsed.get(k)) if parsed.get(k) is not None else base[k]) for k in base.keys()})
    return base
