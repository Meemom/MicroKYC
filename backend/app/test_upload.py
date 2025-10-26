import requests

url = "http://127.0.0.1:8000/verify/gig_worker/upload"
file_path = "sample.pdf"  # your test PDF or image

with open(file_path, "rb") as f:
    files = {"file": (file_path, f)}
    try:
        response = requests.post(url, files=files)
        print("Status code:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Error:", e)
