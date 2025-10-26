# backend/list_models.py
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Available models for this API key:")
for m in client.models.list():
    print(m.name)