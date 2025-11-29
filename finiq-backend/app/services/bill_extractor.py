# app/services/bill_extractor.py
import base64
import json
import os
import re
from datetime import datetime
from typing import Dict, Any

from google import genai

# Use env var in real code
client = genai.Client(api_key="AIzaSyAYrYOlgS7OL6BEsdLzfs_ydjX6rd8RROY")


EXTRACTION_PROMPT = """
You are an assistant that reads Indian bills/receipts/invoices and extracts structured data.

From the given bill image or PDF, extract:

- amount: the TOTAL amount paid (as a number, no currency symbol).
- description: a short human-readable label, e.g. "Swiggy order", "Electricity bill", "DMart groceries".
- date: the transaction date in strict ISO format: YYYY-MM-DD.
- category: one of these exact values:
  - "food"
  - "groceries"
  - "transport"
  - "utilities"
  - "rent"
  - "medical"
  - "entertainment"
  - "shopping"
  - "other"

Rules:
- If multiple numbers appear, choose the final total amount (including taxes).
- If you can't find a date, approximate using any 'Bill Date', 'Invoice Date', etc.
- If you really cannot find a date, use today's date in YYYY-MM-DD.
- If you are unsure about category, use "other".

VERY IMPORTANT:
Return ONLY a valid JSON object in this exact shape:

{
  "amount": 123.45,
  "description": "Some text",
  "date": "2025-11-29",
  "category": "food"
}

No extra keys. No markdown, no ``` fences, no explanation, nothing else.
"""


def _clean_json_text(raw: str) -> str:
    """Remove ```json fences etc. if model returns markdown."""
    raw = raw.strip()
    if raw.startswith("```"):
        lines = raw.splitlines()
        # Drop first and last fence lines
        if lines[0].startswith("```") and lines[-1].startswith("```"):
            raw = "\n".join(lines[1:-1]).strip()
    return raw


def call_gemini_for_bill(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """
    Send bill image/PDF bytes to Gemini and get structured JSON:
    {amount, description, date, category}
    """

    inline_data = {
        "mime_type": mime_type,
        "data": base64.b64encode(image_bytes).decode("utf-8"),
    }

    response = client.models.generate_content(
        model="gemini-2.5-flash",  # free-tier capable model
        contents=[
            {
                "role": "user",
                "parts": [
                    {"text": EXTRACTION_PROMPT},
                    {"inline_data": inline_data},
                ],
            }
        ],
    )

    raw = response.text or ""
    raw = _clean_json_text(raw)

    try:
        data = json.loads(raw)
    except Exception:
        # If parsing fails, we fail fast
        raise ValueError(f"Failed to parse JSON from Gemini: {raw[:200]}")

    # Basic sanitation & casting
    amount_raw = data.get("amount")
    try:
        amount = float(amount_raw)
    except Exception:
        raise ValueError(f"Invalid amount returned by model: {amount_raw}")

    description = (data.get("description") or "").strip() or "Bill payment"
    category = (data.get("category") or "other").strip().lower()

    # Parse date safely
    date_raw = (data.get("date") or "").strip()
    parsed_date = None
    if date_raw:
        # try strict ISO first
        try:
            parsed_date = datetime.fromisoformat(date_raw)
        except ValueError:
            # try a couple of common formats as fallback
            for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%d-%b-%Y"):
                try:
                    parsed_date = datetime.strptime(date_raw, fmt)
                    break
                except ValueError:
                    continue
    if not parsed_date:
        # Fallback to today
        parsed_date = datetime.utcnow()

    return {
        "amount": amount,
        "description": description,
        "category": category,
        "date": parsed_date,
    }
