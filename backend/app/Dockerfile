# ---------- Base Image ----------
FROM python:3.11-slim

# ---------- Environment Setup ----------
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV APP_HOME=/app

WORKDIR $APP_HOME

# ---------- System Dependencies ----------
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# ---------- Install Python Packages ----------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Copy Application Code ----------
COPY app/ app/

# ---------- Expose Port ----------
EXPOSE 8000

# ---------- Run Command ----------
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
