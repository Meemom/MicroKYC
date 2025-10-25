from pydantic import BaseModel 

class OCRResult(BaseModel):
    raw_text: str