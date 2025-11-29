from pydantic import BaseModel
from datetime import date
from typing import Optional

class DailyMessages(BaseModel):
    daily_message: str
    weekly_message: str
    monthly_message: str

class DailyInsights(BaseModel):
    user_id: int
    date: date

    estimated_daily_income: Optional[float] = None
    safe_daily_spend: Optional[float] = None
    recommended_daily_savings: Optional[float] = None

    spent_today: float
    remaining_today: float  # can be negative if overspent
    status: str# "no_income_data" | "within_limit" | "over_limit"

    message: DailyMessages

    class Config:
        orm_mode = True
