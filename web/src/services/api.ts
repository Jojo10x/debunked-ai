export interface PredictionResult {
  label: "Real" | "Fake";
  confidence: number;
  fake_probability: number;
}

export async function predictNews(text: string, imageFile: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("file", imageFile);

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze news");
  }

  return response.json();
}

export async function predictUrl(url: string): Promise<PredictionResult & { scraped_headline?: string }> {
  const response = await fetch("http://127.0.0.1:8000/predict/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze URL");
  }

  return response.json();
}