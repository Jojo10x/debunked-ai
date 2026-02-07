const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface PredictionResult {
  label: "Real" | "Fake";
  confidence: number;
  fake_probability: number;
  scraped_headline?: string;
  summary?: string;
}

export async function predictNews(text: string, imageFile: File, userId: string): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("file", imageFile);
  formData.append("user_id", userId);

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze news");
  }

  return response.json();
}

export async function predictUrl(url: string, userId: string): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze URL");
  }

  return response.json();
}

export async function fetchHistory(userId: string) {
  const response = await fetch(`${API_URL}/history?user_id=${userId}`);
  if (!response.ok) throw new Error("Failed to load history");
  return response.json();
}

export interface ModelStats {
  accuracy: number;
  last_trained: string;
  total_samples: number;
  model_version: string;
  architecture: string;
}

export async function fetchModelStats(): Promise<ModelStats> {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) throw new Error("Failed to load model stats");
  return response.json();
}