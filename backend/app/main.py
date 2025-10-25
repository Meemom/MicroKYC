from fastapi import FastAPI
from app.routes import verify, analytics

app = FastAPI(title="MicroKYC API", version="1.0")

app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "MicroKYC backend is running"}
