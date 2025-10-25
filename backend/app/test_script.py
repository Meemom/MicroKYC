import asyncio
from app.models.risk_models import RiskAssessment  # make sure your Pydantic model is correct
from fraud_detection_service import assess_fraud_risk       # import the function from your code

raw_text = """
Freelancer Income Report

Name: Alex Morgan
Platform: Upwork

Summary of payouts and invoices
Period: Jan 2024 - 2024-03-31

Payments:
- 2024-01-05  Deposit: $1,200.00  (Invoice #U-1001)
- Feb 15, 2024  Deposit: $1,250     (Invoice #U-1015)
- 2024-03-01  Deposit: $8,000      (Invoice #U-1020)
- 2024-03-20  Deposit: $1,300      (Invoice #U-1037)

Bank notes:
Account ending in 4321 — recent deposits from Upwork and direct client transfers.
Declared income estimate (self-reported): $3,000 monthly
Payment cadence claimed: biweekly
"""

parsed_data = {
    "name": "Alex Morgan",
    "platform": "Upwork",
    "income_estimate": 3000,
    "date_range": "2024-01-01 to 2024-03-31",
    "payment_frequency": 14,
    "invoices": ["U-1001", "U-1015", "U-1020", "U-1037"],
    "account_last4": "4321"
}

async def main():
    risk: RiskAssessment = await assess_fraud_risk(parsed_data, raw_text)
    print(risk.json(indent=2))

asyncio.run(main())
