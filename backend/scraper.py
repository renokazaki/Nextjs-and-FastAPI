import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

MIN_TEXT_LENGTH = 200


async def scrape_url(url: str) -> tuple[str, str]:
    """
    Fetch the page at `url` and return (title, body_text).
    Raises HTTPException on failure.
    """
    try:
        async with httpx.AsyncClient(
            headers=HEADERS,
            follow_redirects=True,
            timeout=15.0,
            verify=False,
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=500, detail="Scraping failed: request timed out")
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scraping failed: server returned {e.response.status_code}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {e}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # Remove noise tags
    for tag in soup(["script", "style", "noscript", "nav", "footer", "header", "aside", "form", "iframe"]):
        tag.decompose()

    # Prefer <article> or <main>, fall back to <body>
    content_tag = soup.find("article") or soup.find("main") or soup.find("body")
    text = content_tag.get_text(separator="\n", strip=True) if content_tag else ""

    # Collapse blank lines
    lines = [line for line in text.splitlines() if line.strip()]
    text = "\n".join(lines)

    if len(text) < MIN_TEXT_LENGTH:
        raise HTTPException(
            status_code=422,
            detail="Not enough content to summarize",
        )

    # Truncate to avoid huge prompts (≈ 30 000 chars ≈ 7 500 tokens)
    return title, text[:30_000]
