import requests

# Your API key
API_KEY = "AIzaSyCE8_ESUucXoz47NmQt2Ci28CqRf3i7t1M"

# Endpoint to list models
url = "https://generativelanguage.googleapis.com/v1beta/models"

# Make the request
response = requests.get(url, params={"key": API_KEY})

# Check the response
if response.status_code == 200:
    models = response.json().get("models", [])
    print("Available models for your project:")
    for model in models:
        print(f"- {model['name']} (Capabilities: {', '.join(model.get('supportedMethods', []))})")
else:
    print("Failed to fetch models:", response.status_code, response.text)
