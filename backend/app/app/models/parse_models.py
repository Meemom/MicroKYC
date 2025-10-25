from pydantic import BaseModel


class ParsedDocument(BaseModel):
    name: str
    platform: str
    income_estimate: str
    date_range: str