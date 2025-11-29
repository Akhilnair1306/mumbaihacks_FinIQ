# app/services/daily_insights.py
from datetime import datetime, date as date_cls
from sqlalchemy.orm import Session

from app.models.user import User, Expenses
from app.services.llm_utils import generate_daily_insights_message


def compute_daily_insights(user: User, db: Session, days_in_month: int = 30):
    today = date_cls.today()
    start = datetime(today.year, today.month, today.day)
    end = datetime(today.year, today.month, today.day, 23, 59, 59)

    txs = (
        db.query(Expenses)
        .filter(
            Expenses.user_id == user.id,
            Expenses.date >= start,
            Expenses.date <= end,
            Expenses.amount < 0,
        )
        .all()
    )

    spent_today = sum(abs(tx.amount) for tx in txs)

    # No income data yet
    if not user.estimated_daily:
        status = "no_income_data"
        diff = 0.0

        messages = generate_daily_insights_message(
            name=user.name,
            est_daily=0.0,
            safe_daily_spend=0.0,
            recommended_savings=0.0,
            spent_today=spent_today,
            diff=diff,
            status=status,
            language=getattr(user, "language", "en"),
            weekly_safe_spend=0.0,
            monthly_safe_spend=0.0,
        )

        return {
            "user_id": user.id,
            "date": today,
            "estimated_daily_income": None,
            "safe_daily_spend": None,
            "recommended_daily_savings": None,
            "spent_today": spent_today,
            "remaining_today": 0.0,
            "status": status,
            "message": messages,
        }

    # We have estimated daily income
    est_daily = user.estimated_daily

    # Daily rule
    safe_daily_spend = est_daily * 0.60
    recommended_savings = est_daily * 0.20

    diff = safe_daily_spend - spent_today
    status = "within_limit" if diff >= 0 else "over_limit"

    # NEW: also compute weekly & monthly safe budgets
    weekly_safe_spend = est_daily * 7 * 0.60
    monthly_safe_spend = est_daily * days_in_month * 0.60

    messages = generate_daily_insights_message(
        name=user.name,
        est_daily=est_daily,
        safe_daily_spend=safe_daily_spend,
        recommended_savings=recommended_savings,
        spent_today=spent_today,
        diff=diff,
        status=status,
        language=getattr(user, "language", "en"),
        weekly_safe_spend=weekly_safe_spend,
        monthly_safe_spend=monthly_safe_spend,
    )

    return {
        "user_id": user.id,
        "date": today,
        "estimated_daily_income": est_daily,
        "safe_daily_spend": safe_daily_spend,
        "recommended_daily_savings": recommended_savings,
        "spent_today": spent_today,
        "remaining_today": diff,
        "status": status,
        "message": messages,  # {"daily_message": "...", "weekly_message": "...", "monthly_message": "..."}
    }
