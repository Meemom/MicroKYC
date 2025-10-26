from fastapi import FastAPI, UploadFile, File, HTTPException
from app.routes import verify, analytics
from app.services.gemini_service import process_file

import tempfile
import mimetypes

app = FastAPI(title="gitIT API", version="1.0")

# Include routers
app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "gitIT backend is running"}

@app.post("/process_file")
async def process_file_endpoint(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        suffix = mimetypes.guess_extension(file.content_type) or ""
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Determine file type
        content_type = file.content_type
        if "pdf" in content_type:
            file_type = "pdf"
        elif "image" in content_type:
            file_type = "image"
        else:
            file_type = "text"

        # Process the file via Gemini
        response = process_file(tmp_path, file_type=file_type)
        return {"gemini_response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
