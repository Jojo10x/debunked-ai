import asyncio
import os
import torch
import torch.nn as nn
import json
from datetime import datetime
from torch.utils.data import DataLoader, random_split
from torchvision import transforms
from sqlalchemy import text
from tqdm import tqdm
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.db import engine
from app.models.dataset import FakeNewsDataset
from app.models.classifier import FakeNewsClassifier

IMAGE_DIR = "data/images"
BATCH_SIZE = 16        
EPOCHS = 3           
LEARNING_RATE = 2e-5   
SAVE_PATH = "best_model.pth"

async def get_data_rows():
    """Fetch all valid rows from DB"""
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, text, label FROM dataset_samples LIMIT 2000"))
        rows = result.mappings().all()
    return rows

def train():
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print(" Using Apple M2 GPU (Metal Performance Shaders)")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
        print(" Using NVIDIA GPU")
    else:
        device = torch.device("cpu")
        print(" Using CPU (Slow)")

    print(" Loading data from Database...")
    rows = asyncio.run(get_data_rows())
    print(f" Found {len(rows)} samples.")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    full_dataset = FakeNewsDataset(rows, IMAGE_DIR, transform=transform)

    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

    print(f" Training on {len(train_dataset)} samples, Validating on {len(val_dataset)} samples.")

    model = FakeNewsClassifier()
    model.to(device)

    optimizer = torch.optim.AdamW(model.parameters(), lr=LEARNING_RATE)

    criterion = nn.CrossEntropyLoss()

    best_accuracy = 0.0

    for epoch in range(EPOCHS):
        print(f"\nExample {epoch + 1}/{EPOCHS}")
        print("-" * 10)

        model.train()
        total_loss = 0

        loop = tqdm(train_loader, leave=True)
        for batch in loop:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            images = batch['image'].to(device)
            labels = batch['label'].to(device)

            outputs = model(input_ids, attention_mask, images)
            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            loop.set_description(f"Loss: {loss.item():.4f}")

        avg_train_loss = total_loss / len(train_loader)
        print(f" Average Train Loss: {avg_train_loss:.4f}")

        model.eval()
        correct = 0
        total = 0

        with torch.no_grad(): 
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                images = batch['image'].to(device)
                labels = batch['label'].to(device)

                outputs = model(input_ids, attention_mask, images)

                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        accuracy = 100 * correct / total
        print(f" Validation Accuracy: {accuracy:.2f}%")

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            torch.save(model.state_dict(), SAVE_PATH)
            print("📝 Saving training statistics...")
            stats = {
                "accuracy": round(best_accuracy, 2), 
                "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_samples": len(train_dataset) + len(val_dataset),
                "model_version": "ResNet50 + BERT (v1.1)",
                "architecture": "Multimodal (Image + Text)",
            }
            with open("model_stats.json", "w") as f:
                json.dump(stats, f, indent=4)
            print(" Stats saved to model_stats.json")
            print(f" Model Saved! (New Best Accuracy: {best_accuracy:.2f}%)")

if __name__ == "__main__":
    train()
