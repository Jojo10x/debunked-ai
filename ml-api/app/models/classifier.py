import torch
import torch.nn as nn
from transformers import BertModel
from torchvision import models

class FakeNewsClassifier(nn.Module):
    def __init__(self):
        super(FakeNewsClassifier, self).__init__()
        
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        
        resnet = models.resnet50(pretrained=True)
        self.resnet_features = nn.Sequential(*list(resnet.children())[:-1]) 
        
        self.classifier = nn.Sequential(
            nn.Linear(768 + 2048, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 2) 
        )

    def forward(self, input_ids, attention_mask, images):

        text_out = self.bert(input_ids=input_ids, attention_mask=attention_mask)[1] 
        
        image_out = self.resnet_features(images) 
        image_out = image_out.view(image_out.size(0), -1) 
        
        combined = torch.cat((text_out, image_out), dim=1)
        
        logits = self.classifier(combined)
        return logits