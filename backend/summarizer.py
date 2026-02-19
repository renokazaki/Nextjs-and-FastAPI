import os
from google import genai
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

PROMPT_TEMPLATE = """以下はWebページから取得した本文です。
記事の言語を自動判定し、その言語で3〜5文の簡潔な要約を作成してください。
要約のみ出力し、余分な前置きや説明は不要です。

【本文】
{text}
"""


async def summarize_text(text: str) -> str:
    """
    Call Gemini 2.0 Flash to summarize `text`.
    Returns the summary string.
    Raises HTTPException on error.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

    try:
        client = genai.Client(api_key=api_key)
        prompt = PROMPT_TEMPLATE.format(text=text)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")
