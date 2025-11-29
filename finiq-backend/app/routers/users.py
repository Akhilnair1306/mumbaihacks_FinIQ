from fastapi import APIRouter,Depends,UploadFile,File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import csv
from io import StringIO
from datetime import datetime

from app.core.config import get_db
from app.models.user import User,Expenses
from app.schemas.user import UserCreate,UserResponse, BudgetSummary
from app.services.user import create_user_service,upload_parse_income_csv
from app.services.budget import compute_budget_summary

router = APIRouter(prefix="/users", tags = ["users"])

@router.post("/", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(user_in,db)

@router.post("/{user_id}/upload-income-csv", response_model= UserResponse)
async def upload_csv(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = await upload_parse_income_csv(user_id,file,db)
    return user

@router.get("/{user_id}/budget-summary", response_model=BudgetSummary)
def get_budget_summary(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        summary = compute_budget_summary(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return summary