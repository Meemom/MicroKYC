import json
import os
import re
import statistics
from typing import Dict, Optional

from dotenv import load_dotenv
from google import genai

# Prefer importing the Pydantic model via the package path so imports work
from app.models.risk_models import RiskAssessment

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# default weights (can be overridden by caller)
DEFAULT_WEIGHTS = {
    "income_consistency": 0.35,
    "income_trend": 0.25,
    "document_authenticity": 0.25,
    "payment_frequency": 0.15,
}


def _safe_parse_income_values(text: str):
    # extract dollars like $1200 or raw integers
    nums = [int(n) for n in re.findall(r"\$?(\d{2,6})", text)]
    return nums


def _normalize(value: float, min_v: float, max_v: float) -> float:
    if max_v <= min_v:
        return 0.0
    v = (value - min_v) / (max_v - min_v)
    return max(0.0, min(1.0, v))


async def assess_fraud_risk(parsed_data: Dict, raw_text: str, weights: Optional[Dict] = None) -> RiskAssessment:
    """
    Assess fraud risk combining heuristics and an AI signal (Gemini).
    Returns a RiskAssessment (risk_score 0..1, risk_level, summary).
    """

    weights = weights or DEFAULT_WEIGHTS

    issues = []
    # Required fields check
    required_fields = ["name", "platform", "income_estimate", "date_range"]
    missing = [f for f in required_fields if not parsed_data.get(f)]
    if missing:
        issues.append(f"Missing fields: {', '.join(missing)}")

    # Detect inconsistent date formats in the raw text
    date_pattern = r"(\d{4}-\d{2}-\d{2})|([A-Za-z]{3,9}\s\d{4})"
    date_matches = re.findall(date_pattern, raw_text)
    if date_matches:
        formats = set([m[0] or m[1] for m in date_matches if (m[0] or m[1])])
        if len(formats) > 1:
            issues.append("Multiple date formats detected")

    # Income heuristics: detect outliers and compute simple trend
    income_values = _safe_parse_income_values(raw_text)
    income_consistency_score = 0.0
    income_trend_score = 0.5  # neutral default

    if income_values:
        try:
            mean_val = statistics.mean(income_values)
            std_val = statistics.pstdev(income_values) or 1.0
            within = sum(1 for v in income_values if abs(v - mean_val) <= 2.5 * std_val)
            income_consistency_score = within / len(income_values)
            if len(income_values) >= 2:
                slope = (income_values[-1] - income_values[0]) / len(income_values)
                income_trend_score = _normalize(slope, -mean_val, mean_val)
        except Exception:
            income_consistency_score = 0.5
            income_trend_score = 0.5
    else:
        income_consistency_score = 0.3
        income_trend_score = 0.5

    # AI model scoring — ask Gemini to comment on authenticity / tampering
    ai_risk = 0.3
    ai_reason = ""
    prompt = f"""
You are a document authenticity analyst. The following text is extracted from a financial record.
Provide a JSON object with keys:
  - ai_fraud_risk: float between 0 and 1 (higher = more likely tampered/synthetic)
  - reasoning: short explanation
Text:
{raw_text}
"""
    try:
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt
        )
        text = getattr(response, "text", str(response))
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1 and end > start:
            obj = json.loads(text[start:end])
            ai_risk = float(obj.get("ai_fraud_risk", ai_risk))
            ai_reason = obj.get("reasoning", "")
        else:
            # try direct parse
            obj = json.loads(text)
            ai_risk = float(obj.get("ai_fraud_risk", ai_risk))
            ai_reason = obj.get("reasoning", "")
    except Exception as e:
        ai_risk = 0.3
        ai_reason = f"AI error: {e}"

    # payment_frequency score: prefer explicit field from parsed_data else fallback to (1 - ai_risk)
    payment_frequency_score = 0.5
    pf = parsed_data.get("payment_frequency")
    if isinstance(pf, (int, float)):
        payment_frequency_score = _normalize(float(pf), 0.0, 30.0)
    else:
        payment_frequency_score = 1.0 - ai_risk

    # document_authenticity: combine missing fields and ai_risk (higher -> more authentic)
    doc_auth_score = max(0.0, 1.0 - ai_risk)
    if missing:
        doc_auth_score *= 0.6

    component_scores = {
        "income_consistency": income_consistency_score,
        "income_trend": income_trend_score,
        "document_authenticity": doc_auth_score,
        "payment_frequency": payment_frequency_score,
    }

    weighted_risk = sum(weights.get(k, DEFAULT_WEIGHTS.get(k, 0)) * (1.0 - component_scores[k]) for k in component_scores)
    risk_score = float(max(0.0, min(1.0, weighted_risk)))

    if risk_score >= 0.7:
        risk_level = "High"
    elif risk_score >= 0.4:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    summary_parts = [
        f"ai_reason={ai_reason}" if ai_reason else "",
        f"income_consistency={income_consistency_score:.2f}",
        f"income_trend={income_trend_score:.2f}",
        f"doc_auth={doc_auth_score:.2f}",
        f"payment_freq={payment_frequency_score:.2f}",
    ]
    summary = "; ".join([p for p in summary_parts if p])
    if issues:
        summary = (summary + "; issues: " + ", ".join(issues)) if summary else ", ".join(issues)

    return RiskAssessment(
        risk_score=risk_score,
        risk_level=risk_level,
        summary=summary,
    )
