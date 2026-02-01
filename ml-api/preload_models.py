import torch
from torchvision.models import resnet50, ResNet50_Weights
from transformers import BertTokenizer, BertModel

print("Downloading ResNet50...")
resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)

print("Downloading BERT...")

BertTokenizer.from_pretrained('bert-base-uncased')
BertModel.from_pretrained('bert-base-uncased')

print("Models downloaded and cached successfully!")