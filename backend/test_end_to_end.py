# backend/test_end_to_end.py
import asyncio
import json
import os
import sys

# Allow "backend.app" imports when running from repo root
sys.path.append(os.path.abspath("."))

from app.services.fraud_detection_service import run_full_pipeline

SAMPLE = """
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
    # Force local regex parse (no Gemini) if you want:
    # os.environ["PARSER_MOCK"] = "1"
    result = await run_full_pipeline(SAMPLE, style_mode="all")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())

