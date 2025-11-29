from app.models.user import User

def compute_budget_summary(user: User, days_in_month: int = 30, days_in_week: int = 6):
    if not user.estimated_daily:
        # You can choose to raise error or assume 0
        raise ValueError("Estimated daily income not set for user")

    est_daily = user.estimated_daily
    est_monthly = est_daily * days_in_month
    est_weekly = est_daily * days_in_week

    e_pct = user.essentials_pct or 0.50
    b_pct = user.bills_pct or 0.20
    s_pct = user.savings_pct or 0.20
    f_pct = user.fun_pct or 0.10

    # You could assert these add up <= 1.0, but for now just use them.
    monthly_ess = est_monthly * e_pct
    monthly_bills = est_monthly * b_pct
    monthly_savings = est_monthly * s_pct
    monthly_fun = est_monthly * f_pct

    daily_spend_limit = (est_monthly * 0.50 + est_monthly * 0.10) / 30
    daily_ess = monthly_ess / days_in_month
    daily_bills = monthly_bills / days_in_month
    daily_savings = monthly_savings / days_in_month
    daily_fun = monthly_fun / days_in_month

    monthly_spend_limit  = daily_spend_limit * 30

    weekly_spend_limit = daily_spend_limit * 7

    weekly_ess = monthly_ess / days_in_week
    weekly_bills = monthly_bills / days_in_week
    weekly_savings = monthly_savings / days_in_week
    weekly_fun = monthly_fun / days_in_week

    return {
        "estimated_daily_income": est_daily,
        "estimated_monthly_income": est_monthly,
        "estimated_weekly_income": est_weekly,
        "daily_essentials_limit": daily_ess,
        "daily_bills_limit": daily_bills,
        "daily_savings_target": daily_savings,
        "daily_fun_limit": daily_fun,
        "daily_spend_limit": daily_spend_limit,
        "monthly_spend_limit": monthly_spend_limit,
        "weekly_spend_limit": weekly_spend_limit,
        "monthly_essentials_limit": monthly_ess,
        "monthly_bills_limit": monthly_bills,
        "monthly_savings_target": monthly_savings,
        "monthly_fun_limit": monthly_fun,
        "weekly_essentials_limit": weekly_ess,
        "weekly_bills_limit": weekly_bills,
        "weekly_savings_target": weekly_savings,
        "weekly_fun_limit": weekly_fun,
    }