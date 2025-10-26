from fastapi import FastAPI, UploadFile, File
from routes import verify, analytics
from services.ocr_service import extract_text

app = FastAPI(title="gitIT API", version="1.0")

# Include routers
app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "gitIT backend is running"}

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    text = await extract_text(file)
    return {"extracted_text": text}
