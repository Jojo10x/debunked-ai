from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from typing import List
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from PIL import Image
import io
import pytesseract
import json
import os

from app.core.db import get_db, Scan
from app.services.predictor import FakeNewsPredictor
from app.services.scraper import scrape_article
from app.services.llm import generate_summary

ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(" Server Starting: Loading ML Model...")
    try:
        ml_models["predictor"] = FakeNewsPredictor(model_path="best_model.pth")
        print(" Model Loaded Successfully!")
    except Exception as e:
        print(f" Failed to load model: {e}")
    yield
    ml_models.clear()
    print(" Server Shutting Down: Memory Cleared.")


app = FastAPI(title="Fake News Detector API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanSchema(BaseModel):
    id: UUID
    text: str
    label: str
    confidence: float
    summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


@app.post("/predict")
async def predict_news(
    user_id: str = Form(...),
    text: str = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if "predictor" not in ml_models:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    try:
        image_bytes = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    if not text or text.strip() == "":
        try:
            print(" No text provided. Scanning image for text...")
            pil_image = Image.open(io.BytesIO(image_bytes))

            ocr_text = pytesseract.image_to_string(pil_image)

            text = ocr_text.strip()
            print(f" OCR Extracted: '{text[:100]}...'")

            if not text:
                raise HTTPException(
                    status_code=400, detail="Could not read any text from this image."
                )

        except Exception as e:
            print(f" OCR Failed: {e}")
            raise HTTPException(
                status_code=400, detail="Failed to extract text from image."
            )

    try:
        result = ml_models["predictor"].predict(text, image_bytes)
        summary = generate_summary(text, result["label"], result["confidence"])
        result["summary"] = summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        display_text = text[:200] + "..." if len(text) > 200 else text
        label_prefix = "[OCR] " if not text else ""

        new_scan = Scan(
            user_id=user_id,
            text=f"{label_prefix}{display_text}",
            label=result["label"],
            confidence=result["confidence"],
            summary=result["summary"]
        )
        db.add(new_scan)
        await db.commit()
    except Exception:
        pass

    result["scraped_headline"] = text
    return result


@app.get("/history", response_model=List[ScanSchema])
async def get_history(user_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch the last 10 scans"""
    result = await db.execute(
        select(Scan)
        .where(Scan.user_id == user_id)
        .order_by(Scan.created_at.desc())
        .limit(10)
    )
    scans = result.scalars().all()
    return scans

@app.get("/stats")
async def get_model_stats():
    try:
        with open("model_stats.json", "r") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {
            "accuracy": 0, 
            "last_trained": "Unknown", 
            "status": "No metadata found"
        }

class URLRequest(BaseModel):
    url: str
    user_id: str

@app.post("/predict/url")
async def predict_url(request: URLRequest, db: AsyncSession = Depends(get_db)):
    headline, image_bytes = scrape_article(request.url)

    if not headline or not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Failed to scrape article. The site might be blocking bots.",
        )

    try:
        if "predictor" not in ml_models:
            raise HTTPException(status_code=503, detail="Model is not loaded.")

        result = ml_models["predictor"].predict(headline, image_bytes)
        summary = generate_summary(headline, result["label"], result["confidence"])
        result["summary"] = summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        display_text = headline[:200] + "..." if len(headline) > 200 else headline

        new_scan = Scan(
            user_id=request.user_id,
            text=f"[URL] {display_text}",
            label=result["label"],
            confidence=result["confidence"],
            summary=result["summary"]
        )
        db.add(new_scan)
        await db.commit()
    except Exception:
        pass

    result["scraped_headline"] = headline
    return result
