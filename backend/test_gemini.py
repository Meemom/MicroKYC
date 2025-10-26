from google import genai
from dotenv import load_dotenv
import os

load_dotenv()  # loads your .env
print("GEMINI_API_KEY =", os.getenv("GEMINI_API_KEY"))  # debug, should print your key

client = genai.Client()  # picks up GEMINI_API_KEY automatically

response = client.models.generate_content(
    model="gemini-2.5-flash",  # or any available Gemini model
    contents="Hello from MicroKYC!"
)
print(response.text)
