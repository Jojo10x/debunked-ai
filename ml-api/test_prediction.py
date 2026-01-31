from app.services.predictor import FakeNewsPredictor
import requests

def manual_test():
    predictor = FakeNewsPredictor(model_path="best_model.pth")

    test_text = "Alien spaceships land in Times Square, offering free pizza to tourists!"
    
    print(" Downloading test image...")
    img_url = "https://picsum.photos/200/300" 
    img_bytes = requests.get(img_url).content

    print(f" Analyzing: '{test_text}'")
    result = predictor.predict(test_text, img_bytes)

    print("\n" + "="*30)
    print(f"RESULT: {result['label'].upper()}")
    print(f"Confidence: {result['confidence']}%")
    print("="*30)

if __name__ == "__main__":
    manual_test()