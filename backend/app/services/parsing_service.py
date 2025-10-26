<<<<<<< Updated upstream
import os, json, re
=======
import os
import json
import re
from typing import Dict
>>>>>>> Stashed changes
import google.generativeai as genai
from dotenv import load_dotenv
from app.models.parse_models import ParsedDocument

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
<<<<<<< Updated upstream
_model = genai.GenerativeModel("models/gemini-2.5-pro")

SCHEMA_JSON_EXAMPLE = {
    "name": "...",
    "platform": "...",
    "income_estimate": "...",
    "date_range": "...",
    "payment_frequency": "...",
    "employer_or_client": "...",
    "account_last4": "...."
}

REQUIRED_KEYS = ["name", "platform", "income_estimate", "date_range"]

def _safe_json_extract(text: str) -> dict | None:
    if not text:
        return None
    try:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1 or end <= 0:
            return None
        return json.loads(text[start:end])
    except Exception:
        return None

def _fallback_regex(text: str) -> dict:
    """Very light fallback to avoid returning empty results."""
    data = {k: None for k in SCHEMA_JSON_EXAMPLE.keys()}

    m = re.search(r"(?:Name|Creator)\s*[:\-]\s*(.+)", text, flags=re.I)
    if m: data["name"] = m.group(1).strip()

    m = re.search(r"^(.*?)\s+(?:Payout|Paystub|Statement)", text, flags=re.I|re.M)
    if m: data["platform"] = m.group(1).strip()

    m = re.search(r"Total\s*[:\-]?\s*\$?([\d,]+(?:\.\d{2})?)", text, flags=re.I)
    if m: data["income_estimate"] = m.group(1).replace(",", "")

    m = re.search(r"(?:Period|Date\s*Range)\s*[:\-]\s*(.+)", text, flags=re.I)
    if m: data["date_range"] = m.group(1).strip()

    m = re.search(r"Account\s+ending\s+in\s+(\d{2,6})", text, flags=re.I)
    if m: data["account_last4"] = m.group(1)[-4:]

    return data

async def parse_document(text: str) -> dict:
    """
    Parse financial docs (paystubs/bank statements) to structured JSON using
    Gemini 2.5 Pro, with Strong Repair (retry with 'fix' prompt) and regex fallback.
    """
    # -------- Pass 1: ask Gemini to return ONLY JSON --------
    prompt = f"""
You are a financial document parser. Analyze the document text and return ONLY a JSON object
(no extra commentary). Use this schema and fill all fields (use null if unknown):

{json.dumps(SCHEMA_JSON_EXAMPLE, indent=2)}

Document Text:
{text}
"""
    raw = None
    try:
        r = _model.generate_content(prompt)
        raw = getattr(r, "text", None)
        parsed = _safe_json_extract(raw)
    except Exception:
        parsed = None

    # If missing or schema-incomplete -> Strong Repair pass
    def _missing_required(d: dict | None) -> bool:
        if not isinstance(d, dict):
            return True
        return any(k not in d or d[k] in (None, "", []) for k in REQUIRED_KEYS)

    if _missing_required(parsed):
        fix_prompt = f"""
You previously attempted to parse a document but the JSON was missing required fields.
Return ONLY valid JSON matching this exact schema (keys & types). No prose.

Schema:
{json.dumps(SCHEMA_JSON_EXAMPLE, indent=2)}

If you don't know a value, put null. Do not add extra keys.

Original Document Text:
{text}
"""
        try:
            r2 = _model.generate_content(fix_prompt)
            raw2 = getattr(r2, "text", None)
            parsed2 = _safe_json_extract(raw2)
            if not _missing_required(parsed2):
                parsed = parsed2
        except Exception:
            pass

    # Final fallback: regex
    if _missing_required(parsed):
        parsed = _fallback_regex(text)

    # Merge with defaults and validate
    defaults = {k: None for k in SCHEMA_JSON_EXAMPLE.keys()}
    merged = {**defaults, **(parsed or {})}

    # Pydantic validation/normalization
    return ParsedDocument(**merged).dict()
=======

MODEL_NAME = "models/gemini-2.5-pro"  # from list_models()

def _fallback_parse(text: str) -> Dict:
    # Very light heuristics if the API fails
    parsed = {
        "name": None,
        "platform": None,
        "income_estimate": None,
        "date_range": None,
        "payment_frequency": None,
        "employer_or_client": None,
        "account_last4": None,
    }
    m = re.search(r"Name:\s*([^\n]+)", text, re.I)
    if m: parsed["name"] = m.group(1).strip()
    m = re.search(r"Platform:\s*([^\n]+)", text, re.I)
    if m: parsed["platform"] = m.group(1).strip()
    m = re.search(r"Total:\s*\$?([\d,]+\.\d{2})", text, re.I)
    if m: parsed["income_estimate"] = f"${m.group(1)}"
    m = re.search(r"(Period|Date Range):\s*([^\n]+)", text, re.I)
    if m: parsed["date_range"] = m.group(2).strip()
    m = re.search(r"Account .*?(\d{4})", text, re.I)
    if m: parsed["account_last4"] = m.group(1)
    return parsed

async def parse_document(text: str) -> Dict:
    prompt = f"""
You are a financial document parser AI. Analyze the text below and extract key details.

Text:
{text}

Return ONLY a JSON object with the following fields (no explanation outside JSON):
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
        raw = resp.text or ""
        start = raw.find("{"); end = raw.rfind("}") + 1
        candidate = raw[start:end] if start != -1 and end != -1 else "{}"
        data = json.loads(candidate)
    except Exception as e:
        # print(f"Gemini parse failed: {e}")  # keep quiet in prod
        data = _fallback_parse(text)

    # Ensure all fields exist
    defaults = ParsedDocument().model_dump()
    merged = {**defaults, **{k: (v if v != "" else None) for k,v in data.items()}}
    # Validate & normalize
    return ParsedDocument(**merged).model_dump()
>>>>>>> Stashed changes
