from fastapi import APIRouter


router = APIRouter()


@router.get("/summary")
def analytics_summary():
    # TO DO : Implement real analytics logic
    # For now, return mock data
    return {
    "total_verified": 20,
    "risk_distribution": {
    "low": 12,
    "medium": 6,
    "high": 2
    },
    "top_platforms": ["Uber", "Fiverr", "DoorDash"]
    }