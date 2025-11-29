from fastapi import APIRouter, Depends, HTTPException,UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import get_db
from app.models.user import User, Expenses
from app.schemas.user import TransactionOut, TransactionCreate
from app.services.categorizer import categorize_bucket
from app.services.bill_extractor import call_gemini_for_bill

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionOut)
def create_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db)):
    # 1. Validate user
    user = db.query(User).filter(User.id == tx_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Auto-categorize
    bucket = categorize_bucket(tx_in.category, tx_in.description)

    # 3. Create transaction
    tx = Expenses(
        user_id=user.id,
        date=tx_in.date or datetime.utcnow(),
        amount=tx_in.amount,
        description=tx_in.description,
        category=tx_in.category,
        bucket=bucket,
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx

@router.post("/scan-bill", response_model=TransactionOut)
async def scan_bill_and_create_transaction(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a bill/receipt (image or PDF), extract structured data using Gemini,
    create a transaction in DB, and return the created transaction.
    """

    # 1. Validate user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Read file content
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    mime_type = file.content_type or "image/jpeg"

    # 3. Call Gemini to extract bill data
    try:
        extracted = call_gemini_for_bill(content, mime_type=mime_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    amount = extracted["amount"]
    description = extracted["description"]
    category = extracted["category"]
    tx_date = extracted["date"]

    # Bills are usually expenses → store as negative
    amount = -abs(amount)

    # 4. Auto-categorize bucket
    bucket = categorize_bucket(category, description)

    # 5. Create transaction row
    tx = Expenses(
        user_id=user.id,
        date=tx_date or datetime.utcnow(),
        amount=amount,
        description=description,
        category=category,
        bucket=bucket,
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx
