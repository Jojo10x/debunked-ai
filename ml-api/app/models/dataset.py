import os
import torch
from torch.utils.data import Dataset
from PIL import Image
from transformers import BertTokenizer

class FakeNewsDataset(Dataset):
    def __init__(self, data_rows, image_dir, transform=None, max_len=128):
        print("DEBUG: Loading Updated FakeNewsDataset Class...") 
        self.data_rows = data_rows
        self.image_dir = image_dir
        self.transform = transform
        self.max_len = max_len
        
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

    def __len__(self):
        return len(self.data_rows)

    def __getitem__(self, idx):
        row = self.data_rows[idx]
        row_id = row['id']
        text = row['text']
        
        label = 1 if row['label'] == 'fake' else 0
        
        image_path = os.path.join(self.image_dir, f"{row_id}.jpg") 
        
        try:
            image = Image.open(image_path).convert('RGB')
            if self.transform:
                image = self.transform(image)
        except (FileNotFoundError, OSError):
            image = torch.zeros((3, 224, 224))
            
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'image': image,
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'label': torch.tensor(label, dtype=torch.long),
            'id': str(row_id) 
        }