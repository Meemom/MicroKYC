<<<<<<< Updated upstream
import json
import os
import re
import statistics
from typing import Dict, Optional

from dotenv import load_dotenv
from google import genai

# Prefer importing the Pydantic model via the package path so imports work
from models.risk_models import RiskAssessment
=======
from typing import Dict, List
from app.models.risk_models import RiskAssessment
from app.models.parse_models import ParsedDocument
>>>>>>> Stashed changes

def _score_components(parsed: Dict, raw_text: str) -> Dict[str, float]:
    """
    Very simple heuristics: tune these if you want.
    """
    scores = {
        "rule_based": 0.0,
        "anomaly": 0.0,
        "forgery": 0.0
    }
    issues: List[str] = []

    income = parsed.get("income_estimate") or ""
    # Flag unusually large income in a short period
    try:
        amount = float(income.replace("$","").replace(",",""))
        if amount >= 7500:
            scores["anomaly"] = 0.6
            issues.append("Unusually large total income detected")
    except:
        pass

    # If payment_frequency is blank/unknown -> mild risk
    if not parsed.get("payment_frequency"):
        scores["rule_based"] = max(scores["rule_based"], 0.25)
        issues.append("Payment frequency not provided")

    # If name or employer missing -> mild forgery/consistency risk
    if not parsed.get("name") or not parsed.get("employer_or_client"):
        scores["forgery"] = max(scores["forgery"], 0.3)
        issues.append("Missing name or employer/client")

    return scores, issues

def _to_level(score: float) -> str:
    if score < 0.33: return "LOW"
    if score < 0.66: return "MEDIUM"
    return "HIGH"

async def assess_fraud_risk(parsed: Dict, raw_text: str, doc_id: str | None = None) -> RiskAssessment:
    component_scores, issues = _score_components(parsed, raw_text)
    # Blend scores (simple average; tweak weights as needed)
    risk_score = sum(component_scores.values()) / max(1, len(component_scores))
    risk_level = _to_level(risk_score)

    ai_reason = (
        "Rule-based flags and simple anomaly checks on parsed fields: "
        f"{', '.join(issues) if issues else 'no obvious issues'}."
    )
    recommendation = "Manual review" if risk_level != "LOW" else "Approve"

    return RiskAssessment(
        doc_id=doc_id,
        parsed=ParsedDocument(**parsed),
        component_scores=component_scores,
        issues_detected=issues,
        ai_reason=ai_reason,
        risk_score=round(risk_score, 2),
        risk_level=risk_level,
        recommendation=recommendation,
    )
