<<<<<<< Updated upstream
import os, asyncio
# allow "app.*" imports when running from backend/
import sys
sys.path.insert(0, os.path.dirname(__file__))
=======
import asyncio
from app.services.parsing_service import parse_document
>>>>>>> Stashed changes

from app.services.parsing_service import parse_document

sample_text = """
Upwork Payout Statement
Creator: Alex Morgan
Period: 2024-01-01 to 2024-03-25

Transactions:
2024-01-05  Deposit (Invoice #U-1001)  $1,200.00
2024-02-15  Deposit (Invoice #U-1015)  $1,250.00
2024-03-01  Deposit (Invoice #U-1020)  $8,000.00
2024-03-20  Deposit (Invoice #U-1037)  $1,300.00

Total: $11,750.00
Account ending in 4321
"""

async def main():
    result = await parse_document(sample_text)
    print(result)

if __name__ == "__main__":
    # require key
    assert os.getenv("GEMINI_API_KEY"), "Set GEMINI_API_KEY first"
    asyncio.run(main())
