import sys
import os
import asyncio
import json
import pandas as pd
from sqlalchemy import text
from tqdm import tqdm

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.db import engine

DATA_FILE = "data/train.tsv"
CHUNK_SIZE = 200 

def clean_val(val):
    if pd.isna(val):
        return None
    return val

async def ingest_data():
    print(f" Starting ingestion from {DATA_FILE}...")
    
    if not os.path.exists(DATA_FILE):
        print(f" Error: File {DATA_FILE} not found.")
        return

    chunks = pd.read_csv(
        DATA_FILE, 
        sep='\t', 
        chunksize=CHUNK_SIZE, 
        on_bad_lines='skip' 
    )

    for chunk in tqdm(chunks, desc="Uploading Chunks"):
        records_to_insert = []
        
        for _, row in chunk.iterrows():
            if pd.isna(row.get('image_url')) or pd.isna(row.get('clean_title')):
                continue
            
            label_val = row.get('2_way_label')
            label_str = "fake" if label_val == 1 else "real"

            meta_dict = {
                "subreddit": clean_val(row.get('subreddit')),
                "score": clean_val(row.get('score')),
                "domain": clean_val(row.get('domain'))
            }

            record = {
                "text": row.get('clean_title'),
                "image_url": row.get('image_url'),
                "source": "reddit",
                "external_id": str(row.get('id')),
                "label": label_str,
                "metadata": json.dumps(meta_dict)
            }
            records_to_insert.append(record)

        if records_to_insert:
            try:
                async with engine.begin() as conn:
                    stmt = text("""
                        INSERT INTO dataset_samples (text, image_url, source, external_id, label, metadata)
                        VALUES (:text, :image_url, :source, :external_id, :label, :metadata)
                        ON CONFLICT DO NOTHING
                    """)
                    await conn.execute(stmt, records_to_insert)
            
            except Exception as e:
                print(f"\n Chunk failed: {e}")
                continue

    print(" Ingestion Complete!")

if __name__ == "__main__":
    asyncio.run(ingest_data())