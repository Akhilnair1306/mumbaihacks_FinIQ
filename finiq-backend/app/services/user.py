from fastapi import HTTPException
from app.models.user import User, Expenses
from typing import Set
import csv
from io import StringIO
from datetime import datetime

def parse_date_flex(raw: str) -> datetime:
    raw = raw.strip()
    # Try ISO style first: 2024-11-01
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d-%b-%Y"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            continue
    # If nothing works:
    raise ValueError(f"Unrecognized date format: {raw}")

def safe_float(value):
    """Convert a string to float, treating None/"" as 0."""
    if value is None:
        return 0.0
    value = value.strip()
    if value == "":
        return 0.0
    try:
        return float(value)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid numeric value: {value}"
        )


def create_user_service(user_in, db):
    user = User(
        name = user_in.name,
        language = user_in.language,
        estimated_daily = None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

async def upload_parse_income_csv(user_id, file, db):
    # 1. Check user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Read file content
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded")

    csv_reader = csv.DictReader(StringIO(text))

    if "Txn Date" not in csv_reader.fieldnames or "Credit" not in csv_reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="CSV must contain at least 'date' and 'amount' columns",
        )

    total_income: float = 0.0
    income_days: Set[datetime.date] = set()

    for row in csv_reader:
        # Parse date
        try:
            # adjust if your CSV format is different
            tx_date = parse_date_flex(row["Txn Date"])
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid date format in row: {row.get('date')}",
            )

        # Parse amount
        try:
            amount = safe_float(row["Credit"])
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid amount in row: {row.get('amount')}",
            )

        # Treat **positive amounts as income**
        if amount > 0:
            total_income += amount
            income_days.add(tx_date.date())

    if not income_days:
        raise HTTPException(
            status_code=400,
            detail="No valid income rows (amount > 0) found in CSV",
        )

    # 3. Compute estimated daily income
    num_days = len(income_days)
    estimated_daily_income = total_income / num_days

    # 4. Update user only (no transactions saved)
    user.estimated_daily = estimated_daily_income
    user.estimated_monthly = estimated_daily_income * 30
    user.estimated_weekly =estimated_daily_income * 6
    db.commit()
    db.refresh(user)

    return user