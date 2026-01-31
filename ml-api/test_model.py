import torch
from app.models.classifier import FakeNewsClassifier

def test_model():
    print(" Initializing FakeNewsClassifier...")
    model = FakeNewsClassifier()
    print(" Model loaded.")

    dummy_text_ids = torch.randint(0, 1000, (2, 128))  
    dummy_mask = torch.ones((2, 128))                  
    dummy_images = torch.randn(2, 3, 224, 224)         

    print("⚡ Running forward pass...")
    output = model(dummy_text_ids, dummy_mask, dummy_images)
    
    print(f"   Output Shape: {output.shape}") 
    print(f"   Values: {output}")

    if output.shape == (2, 2):
        print(" Model Architecture Verified!")
    else:
        print(" Shape mismatch.")

if __name__ == "__main__":
    test_model()