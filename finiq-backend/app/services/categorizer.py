SYSTEM_INSTRUCTIONS = """
You are an expense bucket classifier.

You will receive:
- category (already decided by the user)
- description (optional context)

You must output ONLY the bucket:
- "fun"
- "essentials"
- "bills"
- "other"

Mapping rules:
- food_delivery → fun
- eating_out → fun
- transport → essentials
- groceries → essentials
- medical → essentials
- utilities → bills
- rent → essentials
- other → other

Output strictly: {"bucket": "<value>"} with no explanation.
"""

from google import genai
import json

client = genai.Client(api_key="AIzaSyAYrYOlgS7OL6BEsdLzfs_ydjX6rd8RROY")

def bucket_gemini(category: str, description: str = "") -> str:
    prompt = f"""{SYSTEM_INSTRUCTIONS}

Category: {category}
Description: {description}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
    )

    # Extract all text parts
    text = ""
    if response.candidates:
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text"):
                text += part.text

    try:
        data = json.loads(text.strip())
        return data.get("bucket", "other")
    except json.JSONDecodeError:
        return "other"
    
def categorize_bucket(category: str, description: str = ""):
    return bucket_gemini(category, description)
