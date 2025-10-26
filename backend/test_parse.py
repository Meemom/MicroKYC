import asyncio
from tkinter.filedialog import test
from services.parsing_service import parse_document

async def tesgt():
    fake_text = """
    Pay Stub for John Doe
    Platform: DoorDash
    Total Income: $1420 for September 2025
    Payment Frequency: Weekly
    Employer: DoorDash Inc.
    """
    parsed = await parse_document(fake_text)
    print(parsed)

asyncio.run(test())
