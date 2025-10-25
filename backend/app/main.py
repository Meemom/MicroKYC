from fastapi import FastAPI
from routes import verify, analytics


app = FastAPI(title="GigIT")


app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])


@app.get("/")
def root():
return {"message": "GigIT backend is running."}