# backend/app/services/fraud_detection_service.py
import math
from typing import Dict, Any, List

from .parsing_service import parse_document

# If you already had RiskAssessment/Pydantic, keep using it.
# Here we return a plain dict to avoid version mismatches.

def _score_component(value: float) -> float:
    # clamp to [0,1]
    return max(0.0, min(1.0, value))

def _derive_component_scores(parsed: Dict[str, str], raw_text: str) -> Dict[str, float]:
    """
    Very simple heuristics you can evolve later.
    """
    comp = {}

    # 1) Document Authenticity (lower if "Unknown" fields or fishy text)
    unknowns = sum(1 for k, v in parsed.items() if not v or v == "Unknown")
    authenticity = 1.0 - min(0.8, unknowns * 0.15)
    if "sample" in raw_text.lower() or "template" in raw_text.lower():
        authenticity -= 0.25
    comp["document_authenticity"] = _score_component(authenticity)

    # 2) Income Consistency (irregular gets dinged a bit)
    pf = parsed.get("payment_frequency", "").lower()
    income_consistency = 0.75 if "monthly" in pf or "bi" in pf or "weekly" in pf else 0.55
    comp["income_consistency"] = _score_component(income_consistency)

    # 3) Identity Verification (name/platform presence)
    id_ok = 0.5
    if parsed.get("name") not in (None, "", "Unknown"):
        id_ok += 0.25
    if parsed.get("platform") not in (None, "", "Unknown"):
        id_ok += 0.15
    comp["identity_verification"] = _score_component(id_ok)

    # 4) Platform Reputation (demo constants)
    platform = (parsed.get("platform") or "").lower()
    if platform in ("uber", "doordash", "upwork", "fiverr", "lyft", "instacart"):
        platform_rep = 0.85
    elif platform == "unknown":
        platform_rep = 0.5
    else:
        platform_rep = 0.7
    comp["platform_reputation"] = _score_component(platform_rep)

    return comp

def _combine_score(components: Dict[str, float]) -> float:
    # Weighted average (tweak as needed)
    weights = {
        "document_authenticity": 0.40,
        "income_consistency":   0.20,
        "identity_verification":0.20,
        "platform_reputation":  0.20,
    }
    score = 0.0
    for k, v in components.items():
        score += v * weights.get(k, 0.0)
    return _score_component(score)

def _level(score: float) -> str:
    if score >= 0.75:
        return "HIGH"
    if score >= 0.45:
        return "MEDIUM"
    return "LOW"

def _business_style(level: str, score: float, issues: List[str]) -> str:
    return f"{level.title()} Risk ({score:.2f}) — " + (issues[0] if issues else "No major issues detected.")

def _audit_style(level: str, score: float, components: Dict[str, float], issues: List[str]) -> str:
    lines = [
        f"Risk Score: {score:.2f} ({level})",
        "",
        "Component Scores:"
    ]
    for k, v in components.items():
        lines.append(f"- {k.replace('_',' ').title()}: {v:.2f}")
    if issues:
        lines.append("")
        lines.append("Issues Detected:")
        for i in issues:
            lines.append(f"- {i}")
    return "\n".join(lines)

def _compliance_style(level: str, score: float, parsed: Dict[str, str], issues: List[str]) -> str:
    rec = "Approve" if level == "LOW" else ("Manual review" if level == "MEDIUM" else "Decline / request additional docs")
    note = " ".join(issues) if issues else "No material discrepancies noted."
    return (
        f"Subject exhibits a {level.lower()} risk profile (score {score:.2f}). "
        f"Document relates to {parsed.get('platform','Unknown')} earnings; "
        f"stated period: {parsed.get('date_range','Unknown')}. "
        f"{note} Recommendation: {rec}."
    )

async def run_full_pipeline(document_text: str, style_mode: str = "all") -> Dict[str, Any]:
    """
    1) Parse -> 2) Score -> 3) Build explanations (A/B/C).
    style_mode: 'A' | 'B' | 'C' | 'all'
    """
    parsed = await parse_document(document_text)
    components = _derive_component_scores(parsed, document_text)
    score = _combine_score(components)
    level = _level(score)

    issues = []
    if parsed.get("name") in ("Unknown", "", None): issues.append("Name missing or unrecognized")
    if parsed.get("platform") in ("Unknown", "", None): issues.append("Platform missing or unclear")
    if parsed.get("payment_frequency", "").lower() == "irregular": issues.append("Irregular payout cadence reported")

    payload = {
        "parsed": parsed,
        "component_scores": components,
        "risk_score": score,
        "risk_level": level,
    }

    # Styles
    styles = {
        "business": _business_style(level, score, issues),
        "audit": _audit_style(level, score, components, issues),
        "compliance": _compliance_style(level, score, parsed, issues),
    }

    if style_mode.lower() == "a":
        payload["explanation"] = styles["business"]
    elif style_mode.lower() == "b":
        payload["explanation"] = styles["audit"]
    elif style_mode.lower() == "c":
        payload["explanation"] = styles["compliance"]
    else:
        payload["styles"] = styles

    return payload
