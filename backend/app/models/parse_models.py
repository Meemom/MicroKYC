from pydantic import BaseModel, field_validator
from typing import Optional

class ParsedDocument(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    income_estimate: Optional[float] = None
    date_range: Optional[str] = None
    payment_frequency: Optional[str] = None
    employer_or_client: Optional[str] = None
    account_last4: Optional[str] = None

    @field_validator("income_estimate", mode="before")
    def cast_income(cls, v):
        if v is None:
            return None
        if isinstance(v, (int, float)):
            return float(v)
        # Extract number from strings like "$800.75"
        import re
        nums = re.findall(r"[-+]?\d*\.\d+|\d+", str(v))
        return float(nums[0]) if nums else None

    @field_validator("account_last4", mode="before")
    def format_last4(cls, v):
        if v is None:
            return None
        digits = ''.join(filter(str.isdigit, str(v)))
        return digits[-4:] if digits else None

    @field_validator("name", "platform", "date_range", "payment_frequency", "employer_or_client", mode="before")
    def cast_str(cls, v):
        return str(v).strip() if v not in [None, ""] else None
