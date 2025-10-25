from fastapi import FastAPI
from app.routes import verify, analytics

app = FastAPI(title="gitIT API", version="1.0")

app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "gitIT backend is running"}