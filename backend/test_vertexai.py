from google import genai
from google.cloud import aiplatform
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

project_id = os.getenv("PROJECT_ID")  # your GCP project ID
location = os.getenv("LOCATION")      # e.g., "us-central1"

# Initialize Vertex AI
aiplatform.init(project=project_id, location=location)

# Initialize GenAI client using Vertex AI
client = genai.Client(
    vertexai=aiplatform,
    project=project_id,
    location=location
)

# Test a request
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Hello from MicroKYC using Vertex AI!"
)

print(response.text)
