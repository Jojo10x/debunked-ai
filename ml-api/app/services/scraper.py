import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import trafilatura
from fake_useragent import UserAgent


def scrape_article(url: str):
    print(f"Sophisticated Scraper Target: {url}")

    ua = UserAgent()
    headers = {
        "User-Agent": ua.random,
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
    }

    try:
        downloaded = trafilatura.fetch_url(url)

        if not downloaded:
            print(" Trafilatura fetch failed, switching to requests...")
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            response.encoding = response.apparent_encoding
            downloaded = response.text

        metadata = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
            no_fallback=False,
            output_format="json",
            with_metadata=True,
        )
        import json

        headline = None
        main_text = None

        if metadata:
            data = json.loads(metadata)
            headline = data.get("title")
            main_text = data.get("text")

        soup = BeautifulSoup(downloaded, "html.parser")

        if not headline:
            print("Metadata missing title, scraping manually...")
            og_title = soup.find("meta", property="og:title")
            headline = (
                og_title["content"]
                if og_title
                else (soup.title.string if soup.title else None)
            )

        if not main_text or len(main_text) < 100:
            print("Metadata missing text, scraping manually...")
            body_content = (
                soup.find("div", {"id": "bodyContent"})
                or soup.find("article")
                or soup.find("main")
                or soup.body
            )
            if body_content:
                paragraphs = body_content.find_all("p")
                valid_paras = [
                    p.get_text() for p in paragraphs if len(p.get_text().split()) > 5
                ]
                main_text = "\n".join(valid_paras)

        image_url = None

        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            image_url = og_image["content"]

        if not image_url:
            twitter_img = soup.find("meta", attrs={"name": "twitter:image"})
            if twitter_img:
                image_url = twitter_img.get("content")

        if not image_url:
            target_container = soup.find("article") or soup.find("main") or soup
            images = target_container.find_all("img")

            for img in images:
                src = img.get("src")
                if not src:
                    continue

                if any(
                    x in src.lower()
                    for x in [".svg", "logo", "icon", "avatar", "spacer"]
                ):
                    continue

                width = img.get("width")
                if width and width.isdigit() and int(width) < 200:
                    continue

                image_url = src
                break

        if not headline or not image_url:
            print(" Failed to find critical content.")
            return None, None

        if not image_url.startswith("http"):
            image_url = urljoin(url, image_url)

        print(
            f"Success: {headline[:30]}... | Text Length: {len(main_text) if main_text else 0} chars"
        )

        img_response = requests.get(image_url, headers=headers, timeout=10)
        return headline, main_text, img_response.content

    except Exception as e:
        print(f" Critical Scraper Error: {e}")
        return None, None, None
