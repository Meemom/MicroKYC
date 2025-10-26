from typing import Optional
from pydantic import BaseModel

class ParsedDocument(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    income_estimate: Optional[str] = None
    date_range: Optional[str] = None
    payment_frequency: Optional[str] = None
    employer_or_client: Optional[str] = None
    account_last4: Optional[str] = None
