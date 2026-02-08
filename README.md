# Debunked AI: Multimodal Fake News Detection System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Python Version](https://img.shields.io/badge/python-3.9-blue)
![License](https://img.shields.io/badge/license-MIT-grey)

**Live Application:** [https://debunked-ai.vercel.app](https://debunked-ai.vercel.app)  
**API Documentation:** [https://jojo10x-debunked-api.hf.space/docs](https://jojo10x-debunked-api.hf.space/docs)

## Project Overview

Debunked AI is a full-stack automated fact-checking platform designed to combat multimodal misinformation. Unlike traditional verification systems that analyze text in isolation, this application utilizes a **Multimodal Machine Learning** approach to detect incongruities between news headlines and their associated imagery.

The system integrates a custom PyTorch model (ResNet50 + BERT) for classification with a Large Language Model (Llama 3 via Groq) to generate human-readable explanations for the verdict. The architecture is fully containerized and deployed on a cloud-native stack, demonstrating a complete MLOps pipeline from training to production.

## System Architecture

The application follows a microservices architecture, separating the inference engine from the client interface.

1.  **Client Layer:** Next.js frontend hosted on Vercel's Edge Network.
2.  **API Layer:** FastAPI backend hosted on Hugging Face Spaces (Dockerized).
3.  **Inference Engine:**
    * **Visual Analysis:** ResNet50 (Pre-trained on ImageNet) extracts feature vectors from images.
    * **Linguistic Analysis:** BERT (bert-base-uncased) extracts semantic embeddings from text.
    * **Fusion Layer:** Concatenates visual and linguistic vectors to predict a "Real" or "Fake" probability.
4.  **Explanation Layer:** Llama 3 (via Groq) generates context-aware summaries of the analysis.
5.  **Persistence Layer:** Supabase (PostgreSQL) stores user query history and analytical results.

## Key Features

* **Multimodal Fusion Analysis:** Simultaneously processes visual and linguistic data to identify conflicting information, achieving higher accuracy than unimodal models.
* **Generative Explanations:** Leverages Llama 3 (70b-versatile) to provide context-aware summaries explaining why a specific article was flagged as "Fake" or "Real."
* **Real-Time Inference:** Optimized Docker container deployment ensures low-latency analysis for end-users.
* **User History & Analytics:** Integrated with Supabase to track user scan history and monitor aggregate model performance.
* **Automated MLOps Pipeline:** Includes a training script that automatically updates model weights and version control statistics upon dataset expansion.

## Technology Stack

### Artificial Intelligence
* **Framework:** PyTorch
* **Vision Model:** ResNet50
* **Language Model:** BERT
* **Generative AI:** Llama 3 via Groq SDK

### Backend Infrastructure
* **Runtime:** Python 3.9
* **API Framework:** FastAPI
* **Database:** Supabase (PostgreSQL)
* **Containerization:** Docker
* **Hosting:** Hugging Face Spaces (16GB RAM instance)

### Frontend Interface
* **Framework:** Next.js 14 (React)
* **Styling:** Tailwind CSS
* **Authentication:** Clerk
* **Hosting:** Vercel
