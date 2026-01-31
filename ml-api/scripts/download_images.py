import sys
import os
import asyncio
import httpx
import aiofiles
from sqlalchemy import text
from tqdm import tqdm
from PIL import Image
import io

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.db import engine

IMAGE_DIR = "data/images"
CONCURRENCY_LIMIT = 20  

def verify_image(data):
    image = Image.open(io.BytesIO(data))
    image.verify()

async def download_worker(semaphore, client, row):
    row_id = row['id']
    url = row['image_url']
    
    if not url: return False

    try:
        ext = url.split('.')[-1].split('?')[0]
        if len(ext) > 4 or not ext: ext = "jpg"
    except:
        ext = "jpg"
    
    filename = f"{row_id}.{ext}"
    filepath = os.path.join(IMAGE_DIR, filename)

    async with semaphore:
        try:
            if os.path.exists(filepath):
                return True 

            response = await client.get(url, timeout=15.0, follow_redirects=True)
            
            if response.status_code != 200:
                return False
            
            await asyncio.to_thread(verify_image, response.content)
            
            async with aiofiles.open(filepath, 'wb') as f:
                await f.write(response.content)
            
            return True

        except Exception:

            return False

async def main():
    print(f" Starting Batch Image Downloader...")
    os.makedirs(IMAGE_DIR, exist_ok=True)
    
    async with engine.connect() as conn:
        print(" Fetching URLs from database...")
        result = await conn.execute(text("SELECT id, image_url FROM dataset_samples LIMIT 5000"))
        rows = result.mappings().all()

    print(f" Found {len(rows)} candidates. Starting download...")

    semaphore = asyncio.Semaphore(CONCURRENCY_LIMIT)
    headers = {"User-Agent": "Mozilla/5.0 (FakeNewsResearch/1.0)"}
    
    async with httpx.AsyncClient(headers=headers, verify=False) as client:
        tasks = []
        for row in rows:
            task = download_worker(semaphore, client, row)
            tasks.append(task)

        results = []
        for f in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Downloading"):
            res = await f
            results.append(res)

    success_count = sum(results)
    print(f" Finished!")
    print(f"   Success: {success_count}")
    print(f"   Failed/Skipped: {len(rows) - success_count}")
    print(f" Images saved to: {os.path.abspath(IMAGE_DIR)}")

if __name__ == "__main__":
    asyncio.run(main())