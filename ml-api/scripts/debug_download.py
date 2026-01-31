import sys
import os
import asyncio
import httpx
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.db import engine

async def debug_one():
    print(" Fetching one URL to test...")
    
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, image_url FROM dataset_samples LIMIT 1"))
        row = result.mappings().first()

    if not row:
        print(" No data in database!")
        return

    url = row['image_url']
    print(f" Testing URL: {url}")

    headers = {"User-Agent": "Mozilla/5.0 (FakeNewsResearch/1.0)"}
    
    print(" Attempting download...")
    async with httpx.AsyncClient(headers=headers, verify=False) as client: 
        try:
            response = await client.get(url, timeout=10.0, follow_redirects=True)
            print(f" Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f" Success! Content-Length: {len(response.content)} bytes")
                with open("debug_test_image.jpg", "wb") as f:
                    f.write(response.content)
                print(" Saved to debug_test_image.jpg")
            else:
                print(" Failed with non-200 status.")
                
        except Exception as e:
            print(f" CRITICAL ERROR: {type(e).__name__}")
            print(f"   Details: {e}")

if __name__ == "__main__":
    asyncio.run(debug_one())