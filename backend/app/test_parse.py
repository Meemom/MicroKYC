import asyncio
from app.services.parsing_service import parse_document


async def test_parse():
    fake_text = """
    Pay Stub for John Doe
    Platform: DoorDash
    Total Income: $1420 for September 2025
    Payment Frequency: Weekly
    Employer: DoorDash Inc.
    """
    parsed = await parse_document(fake_text)
    print(parsed)


if __name__ == "__main__":
    asyncio.run(test_parse())
