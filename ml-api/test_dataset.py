import sys
import os
import asyncio
import torch
from torchvision import transforms
from torch.utils.data import DataLoader
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.db import engine
from app.models.dataset import FakeNewsDataset

IMAGE_DIR = "data/images"

async def test_dataloader():
    print(" Testing PyTorch Dataset & DataLoader...")

    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, text, label FROM dataset_samples LIMIT 32"))
        rows = result.mappings().all()

    print(f" Loaded {len(rows)} rows from DB.")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    dataset = FakeNewsDataset(rows, IMAGE_DIR, transform=transform)

    loader = DataLoader(dataset, batch_size=4, shuffle=True)

    try:
        batch = next(iter(loader))

        print("\n Batch Loaded Successfully!")
        print(f"   Image Batch Shape: {batch['image'].shape}")
        print(f"   Text Token Shape:  {batch['input_ids'].shape}")
        print(f"   Labels:            {batch['label']}")
        print(f"   IDs:               {batch['id']}") 
        
        if batch['image'].shape == (4, 3, 224, 224):
            print("\n Verification Passed: Ready for Training!")
    except Exception as e:
        print(f"\n Error loading batch: {e}")

if __name__ == "__main__":
    asyncio.run(test_dataloader())