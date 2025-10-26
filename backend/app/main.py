<<<<<<< Updated upstream
from fastapi import FastAPI, UploadFile, File
from app.routes import verify, analytics
from app.services.ocr_service import extract_text
=======
# backend/app/main.py
from fastapi import FastAPI
from app.routes import verify  # ✅ make sure this import works

app = FastAPI(title="GigIT API", version="1.0")
>>>>>>> Stashed changes

# include router
app.include_router(verify.router, prefix="/verify", tags=["Verification"])

@app.get("/")
def root():
<<<<<<< Updated upstream
    return {"message": "gitIT backend is running"}

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    text = await extract_text(file)
    return {"extracted_text": text}
=======
    return {"message": "GigIT backend is running"}
>>>>>>> Stashed changes
