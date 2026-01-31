import sys
import os
import asyncio
import httpx
import io
from sqlalchemy import text
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.db import engine

IMAGE_DIR = "data/images"

def verify_image(data):
    image = Image.open(io.BytesIO(data))
    image.verify()

async def download_one(client, row):
    url = row['image_url']
    row_id = row['id']
    print(f"\n Attempting: {url}")

    try:
        response = await client.get(url, timeout=10.0, follow_redirects=True)
        
        if response.status_code != 200:
            print(f"    Failed Status: {response.status_code}")
            return False

        await asyncio.to_thread(verify_image, response.content)
        print(f"    Image Verified ({len(response.content)} bytes)")
        
        ext = "jpg"
        filepath = os.path.join(IMAGE_DIR, f"{row_id}.{ext}")
        with open(filepath, "wb") as f:
            f.write(response.content)
        print("    Saved to disk")
        return True

    except httpx.ConnectTimeout:
        print("    Error: Connection Timed Out")
    except httpx.ConnectError as e:
        print(f"    Error: Connection Failed ({e})")
    except Exception as e:
        print(f"    CRITICAL ERROR: {type(e).__name__} - {e}")
    
    return False

async def main():
    print(" Starting Diagnostic Run (Top 10 URLs)...")
    os.makedirs(IMAGE_DIR, exist_ok=True)
    
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, image_url FROM dataset_samples LIMIT 10"))
        rows = result.mappings().all()

    headers = {"User-Agent": "Mozilla/5.0 (FakeNewsResearch/1.0)"}
    
    async with httpx.AsyncClient(headers=headers, verify=False) as client:
        for row in rows:
            await download_one(client, row)

if __name__ == "__main__":
    asyncio.run(main())