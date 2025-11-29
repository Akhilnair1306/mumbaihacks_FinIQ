# app/services/llm_utils.py
import os
import json
import re
from typing import Literal, Dict
from google import genai

client = genai.Client(api_key="AIzaSyAYrYOlgS7OL6BEsdLzfs_ydjX6rd8RROY")


def generate_daily_insights_message(
    name: str,
    est_daily: float,
    safe_daily_spend: float,
    recommended_savings: float,
    spent_today: float,
    diff: float,
    status: Literal["within_limit", "over_limit", "no_income_data"],
    language: str = "en",
    weekly_safe_spend: float = 0.0,
    monthly_safe_spend: float = 0.0,
) -> Dict[str, str]:
    """
    Return:
    {
      "daily_message": str,
      "weekly_message": str,
      "monthly_message": str
    }
    """

    context = f"""
You are Finiq, a friendly financial coach for Indian gig workers.

User name: {name}
Estimated daily income: ₹{round(est_daily) if est_daily else 'unknown'}

Safe budgets:
- Safe DAILY spend: ₹{round(safe_daily_spend) if safe_daily_spend else 'unknown'}
- Safe WEEKLY spend: ₹{round(weekly_safe_spend) if weekly_safe_spend else 'unknown'}
- Safe MONTHLY spend: ₹{round(monthly_safe_spend) if monthly_safe_spend else 'unknown'}

Recommended daily savings: ₹{round(recommended_savings) if recommended_savings else 'unknown'}
Spent today so far: ₹{round(spent_today)}
Remaining vs daily safe limit: ₹{round(diff)} (positive = under limit, negative = over limit)
Status: {status}

Constraints:
- Do NOT invent new numbers; only refer generically to 'your safe daily/weekly/monthly budget' if needed.
- If you mention specific rupee amounts, use only the ones shown above.
- Each message should be 1–2 sentences, supportive, non-judgmental, and practical.
"""

    if status == "no_income_data":
        user_msg = (
            "Income data is missing. Write three short messages:\n"
            "- daily_message: Explain that you can't give today's limit until they upload a bank statement.\n"
            "- weekly_message: Explain that weekly planning also needs income data.\n"
            "- monthly_message: Encourage them that once data is uploaded, you can help build monthly stability."
        )
    elif status == "within_limit":
        user_msg = (
            "The user is within today's safe spending limit. Write:\n"
            "- daily_message: praise them, mention they are within their safe daily limit.\n"
            "- weekly_message: connect today's good behavior to staying on track for the week (safe weekly spend).\n"
            "- monthly_message: connect this pattern to building long-term stability (safe monthly spend & savings)."
        )
    else:  # over_limit
        user_msg = (
            "The user has overspent today's limit. Write:\n"
            "- daily_message: gently highlight overspending and suggest one or two simple actions today.\n"
            "- weekly_message: talk about rebalancing the week's spending to stay near the safe weekly budget.\n"
            "- monthly_message: frame this as a small setback and encourage better habits for the rest of the month."
        )

    if language == "hi":
        user_msg += "\nRespond in simple Hindi, you may mix common English money words."
    elif language == "hinglish":
        user_msg += "\nRespond in Hinglish (Hindi+English mix), casual and friendly."
    else:
        user_msg += "\nRespond in simple English."

    user_msg += """
Return ONLY a valid JSON object with exactly these 3 keys:
{
  "daily_message": "...",
  "weekly_message": "...",
  "monthly_message": "..."
}

Do NOT wrap the JSON in backticks or markdown code blocks.
Do NOT add any text before or after the JSON.
"""

    prompt = context + "\n\n" + user_msg

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
    )

    raw = response.text.strip()

    # 🔧 Handle cases where it STILL wraps in ```json ... ``` (like your current output)
    if raw.startswith("```"):
        lines = raw.splitlines()
        # Drop first and last lines if they are code fences
        if lines[0].startswith("```") and lines[-1].startswith("```"):
            raw = "\n".join(lines[1:-1]).strip()

    try:
        data = json.loads(raw)
        return {
            "daily_message": str(data.get("daily_message", "")).strip(),
            "weekly_message": str(data.get("weekly_message", "")).strip(),
            "monthly_message": str(data.get("monthly_message", "")).strip(),
        }
    except Exception:
        # Fallback: if JSON is broken, at least don't break your API
        return {
            "daily_message": raw,
            "weekly_message": "",
            "monthly_message": "",
        }
