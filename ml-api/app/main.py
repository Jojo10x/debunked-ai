from fastapi import FastAPI

app = FastAPI(title="Multimodal Fake News Detection API")

@app.get("/")
def read_root():
    return {"status": "online", "model": "unloaded"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}