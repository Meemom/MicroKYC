# backend/app/main.py
from fastapi import FastAPI
from app.routes import verify  # ✅ make sure this import works

app = FastAPI(title="GigIT API", version="1.0")

# include router
app.include_router(verify.router, prefix="/verify", tags=["Verification"])

@app.get("/")
def root():
    return {"message": "GigIT backend is running"}
