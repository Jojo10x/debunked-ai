import asyncio
from sqlalchemy import text
from app.core.db import engine

async def test_connection():
    async with engine.begin() as conn:
        print(" Pinging database...")
        await conn.execute(text("SELECT 1"))
        print(" Database connection successful!")

        print(" Attempting to insert a test record...")
        await conn.execute(text("""
            INSERT INTO dataset_samples (text, label, source, external_id)
            VALUES ('This is a test fake news entry from Python', 'fake', 'test_script', 'test_001')
        """))
        print(" Insert successful!")

if __name__ == "__main__":
    asyncio.run(test_connection())