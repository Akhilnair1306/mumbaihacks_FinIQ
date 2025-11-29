from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    language: Optional[str] = "en"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    estimated_daily: Optional[float] = None

class BudgetSummary(BaseModel):
    estimated_daily_income: float
    estimated_monthly_income: float
    estimated_weekly_income:float

    daily_essentials_limit: float
    daily_bills_limit: float
    daily_savings_target: float
    daily_fun_limit: float
    daily_spend_limit: float

    weekly_essentials_limit: float
    weekly_bills_limit: float
    weekly_savings_target: float
    weekly_fun_limit: float
    weekly_spend_limit: float

    monthly_essentials_limit: float
    monthly_bills_limit: float
    monthly_savings_target: float
    monthly_fun_limit: float
    monthly_spend_limit: float

class TransactionCreate(BaseModel):
    user_id: int
    amount: float            # +ve income, -ve expense
    description: str
    date: Optional[datetime] = None
    category: Optional[str]

class TransactionOut(BaseModel):
    id: int
    user_id: int
    amount: float
    description: str
    date: datetime
    bucket: Optional[str]
    
    class Config:
        orm_mode = True