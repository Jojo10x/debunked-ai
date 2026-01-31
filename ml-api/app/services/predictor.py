import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io

from app.models.classifier import FakeNewsClassifier
from transformers import BertTokenizer

class FakeNewsPredictor:
    def __init__(self, model_path="best_model.pth"):
        print(f" Loading Model from {model_path}...")
        
        if torch.backends.mps.is_available():
            self.device = torch.device("mps")
        elif torch.cuda.is_available():
            self.device = torch.device("cuda")
        else:
            self.device = torch.device("cpu")

        self.model = FakeNewsClassifier()
        
        state_dict = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(state_dict)
        
        self.model.to(self.device)
        self.model.eval()
        
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        print(" Predictor Ready!")

    def predict(self, text, image_bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device) 

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=128,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )
        
        input_ids = encoding['input_ids'].to(self.device)
        attention_mask = encoding['attention_mask'].to(self.device)

        with torch.no_grad():
            logits = self.model(input_ids, attention_mask, image_tensor)
            probabilities = F.softmax(logits, dim=1)
            
            fake_prob = probabilities[0][1].item()
            
            label = "Fake" if fake_prob > 0.5 else "Real"
            confidence = fake_prob if label == "Fake" else 1 - fake_prob
            
            return {
                "label": label,
                "confidence": round(confidence * 100, 2),
                "fake_probability": fake_prob
            }