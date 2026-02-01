import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_summary(text: str, label: str, confidence: float):
    try:
        if len(text) < 50:
            return "Text too short for detailed analysis."

        prompt = f"""
        You are an AI Fact Checker. 
        Analyze this news snippet: "{text[:1000]}"
        
        Our automated system flagged this as {label} with {confidence}% confidence.
        
        Provide a 2-sentence explanation of why this might be {label}. 
        - If Real: Mention why it sounds credible (neutral tone, specific details).
        - If Fake: Point out sensationalism, lack of sources, or logical errors.
        - Do NOT mention "I am an AI". Just give the analysis.
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful and concise fact-checking assistant."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile", 
            temperature=0.5,
            max_tokens=100,
        )

        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"LLM Error: {e}")
        return "Analysis unavailable at the moment."