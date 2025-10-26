import pytesseract

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Test the installation
print(pytesseract.get_tesseract_version())
