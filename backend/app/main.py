from fastapi import FastAPI, UploadFile, File, HTTPException
from app.routes import verify, analytics
from app.services.ocr_proc import process_image  # <-- updated import
from app.models.ocr_models import OCRResult  # <-- if you’re using this model

app = FastAPI(title="gitIT API", version="1.0")

# Include routers
app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "gitIT backend is running"}

@app.post("/ocr", response_model=OCRResult)
async def ocr_endpoint(file: UploadFile = File(...)):
    """Upload an image and extract text using Tesseract OCR."""
    try:
        # Save uploaded file temporarily
        contents = await file.read()
        with open(f"/tmp/{file.filename}", "wb") as f:
            f.write(contents)

        # Process OCR
        result = process_image(f"/tmp/{file.filename}")
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
