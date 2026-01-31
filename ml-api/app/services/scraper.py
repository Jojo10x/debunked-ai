import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_article(url: str):
    print(f" Scraping URL: {url}")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')

        headline = None
        
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            headline = og_title["content"]
        elif soup.title:
            headline = soup.title.get_text().strip()
        elif soup.h1:
            headline = soup.h1.get_text().strip()

        image_url = None
        
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            image_url = og_image["content"]
            
        elif soup.find("meta", attrs={"name": "twitter:image"}):
            image_url = soup.find("meta", attrs={"name": "twitter:image"})["content"]

        if not image_url:
            images = soup.find_all("img")
            for img in images:
                src = img.get("src", "")
                if not src:
                    continue
                
                if ".svg" in src.lower():
                    continue
                if "logo" in src.lower() or "icon" in src.lower():
                    continue
                
                width = img.get("width")
                if width and width.isdigit() and int(width) < 50:
                    continue

                image_url = src
                break 

        print(f" Found Headline: {headline}")
        print(f" Found Image: {image_url}")

        if not headline or not image_url:
            raise Exception("Missing Headline or Image")

        if image_url.startswith("//"):
            image_url = "https:" + image_url
        elif image_url.startswith("/"):
            image_url = urljoin(url, image_url)

        img_response = requests.get(image_url, headers=headers, timeout=10)
        img_data = img_response.content

        return headline, img_data

    except Exception as e:
        print(f" Error in scraper: {e}")
        return None, None