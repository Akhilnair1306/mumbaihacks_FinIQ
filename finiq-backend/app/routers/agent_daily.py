# app/routers/agent_daily.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# from app.database import get_db
from app.models.user import User
from app.core.config import get_db
from app.services.daily_insights import compute_daily_insights
from app.schemas.daily_insights import DailyInsights

router = APIRouter(prefix="/agent", tags=["daily-insights"])


@router.get("/{user_id}/daily-insights", response_model=DailyInsights)
def get_daily_insights(user_id: int, db: Session = Depends(get_db)):
    # 1. Fetch user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Compute insights
    data = compute_daily_insights(user, db)

    # 3. Return as Pydantic model (FastAPI handles mapping)
    return data
