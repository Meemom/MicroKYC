import asyncio
from app.services.ocr_service import extract_text_from_image

async def run_test():
    img_path = "app/test_docs/images/sample_paystub.png"  # Change path if needed
    
    with open(img_path, "rb") as f:
        img_bytes = f.read()

    text = await extract_text_from_image(img_bytes)
    print("\n=== OCR OUTPUT ===")
    print(text)

if __name__ == "__main__":
    asyncio.run(run_test())

