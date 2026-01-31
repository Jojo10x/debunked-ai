import torch
from transformers import DistilBertModel, DistilBertTokenizer
from torchvision import models
import nltk

print(" Starting Pre-Download of Backup Assets...")

print(" Downloading DistilBERT...")
DistilBertModel.from_pretrained('distilbert-base-uncased')
DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

print(" Downloading ResNet18...")
models.resnet18(pretrained=True)

print(" Downloading NLTK Stopwords...")
try:
    nltk.download('punkt')
    nltk.download('stopwords')
except:
    pass

print(" All backup assets cached safely!")