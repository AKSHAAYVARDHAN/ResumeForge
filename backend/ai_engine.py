import os
import re
import json
import traceback
from dotenv import load_dotenv

load_dotenv()

# ── API key guard ──────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Add it to your .env file and restart."
    )

print(f"[ai_engine] GEMINI_API_KEY loaded ({GEMINI_API_KEY[:8]}...)")

# Lazy import so a missing package gives a clear error message
try:
    from google import genai
except ImportError:
    raise ImportError(
        "google-genai package not found. Run: python -m pip install google-genai"
    )

client = genai.Client(api_key=GEMINI_API_KEY)

# ── Prompt ─────────────────────────────────────────────────────────────────────
ANALYSIS_PROMPT = """You are an expert resume evaluator and career coach with deep expertise across ALL professional domains including Technology, Software Engineering, Data Science, Hospitality, Finance, Marketing, Healthcare, Education, Legal, Creative Arts, Sales, Operations, Human Resources, and more.

Analyze the following resume and return a STRICTLY valid JSON object.
Return ONLY the JSON -- no markdown fences, no explanation, no text before or after.

The JSON must have EXACTLY this structure:
{
  "domain": "string (e.g. Technology, Hospitality, Finance, Healthcare, Marketing)",
  "ats_score": 0,
  "resume_strength": "Weak | Moderate | Strong",
  "experience_level": "Beginner | Intermediate | Advanced",
  "extracted_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "role_fit": [
    { "role": "Role Title", "match_percentage": 0 },
    { "role": "Role Title", "match_percentage": 0 },
    { "role": "Role Title", "match_percentage": 0 },
    { "role": "Role Title", "match_percentage": 0 },
    { "role": "Role Title", "match_percentage": 0 }
  ],
  "section_analysis": {
    "summary":    { "present": true, "score": 0, "feedback": "string" },
    "experience": { "present": true, "score": 0, "feedback": "string" },
    "education":  { "present": true, "score": 0, "feedback": "string" },
    "skills":     { "present": true, "score": 0, "feedback": "string" },
    "projects":   { "present": true, "score": 0, "feedback": "string" }
  },
  "actionable_suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3",
    "Specific suggestion 4",
    "Specific suggestion 5",
    "Specific suggestion 6"
  ],
  "summary_insight": "2-3 sentence overall assessment tailored to the detected domain."
}

Rules:
- ats_score must be a number 0-100
- match_percentage values must be numbers 0-100
- resume_strength must be exactly one of: Weak, Moderate, Strong
- experience_level must be exactly one of: Beginner, Intermediate, Advanced
- Be domain-aware: evaluate relative to the candidate's detected industry
- Role fit roles must be realistic for the domain
- Return ONLY the JSON object, nothing else

Resume:
"""


# ── JSON extraction ────────────────────────────────────────────────────────────
def extract_json(raw_text: str) -> str:
    """
    Robustly pull the first complete JSON object out of a Gemini response,
    handling markdown fences (```json ... ```) and any leading/trailing text.
    """
    raw_text = raw_text.strip()

    # Strategy 1: Strip markdown fences using regex
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
    if fence_match:
        return fence_match.group(1).strip()

    # Strategy 2: Find the outermost { ... } block
    brace_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if brace_match:
        return brace_match.group(0).strip()

    # Nothing usable found -- return as-is and let json.loads raise a clear error
    return raw_text


# ── Main analysis function ─────────────────────────────────────────────────────
def analyze_resume(resume_text: str) -> dict:
    """Send resume text to Gemini and return a structured analysis dict."""

    if not resume_text or len(resume_text.strip()) < 50:
        raise ValueError("Resume text is too short or empty (minimum 50 characters).")

    prompt = ANALYSIS_PROMPT + resume_text[:8000]  # ~8k chars stays well within context
    raw = None  # ensure it is always defined before the try block

    try:
        print("[ai_engine] Calling Gemini API (gemini-2.0-flash)...")

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        raw = response.text
        print(f"[ai_engine] Raw response (first 500 chars):\n{raw[:500]}\n{'-'*60}")

        cleaned = extract_json(raw)
        print(f"[ai_engine] Cleaned JSON (first 300 chars):\n{cleaned[:300]}")

        result = json.loads(cleaned)
        print("[ai_engine] JSON parsed successfully.")
        return result

    except json.JSONDecodeError as e:
        snippet = raw[:800] if raw else "<no response captured>"
        print(f"[ai_engine] JSON parse error: {e}")
        print(f"[ai_engine] Raw text was:\n{snippet}")
        raise RuntimeError(
            f"Gemini returned a response that could not be parsed as JSON. "
            f"Parse error: {e}. Raw snippet: {snippet[:300]}"
        )

    except Exception as e:
        print(f"[ai_engine] Unexpected error: {e}")
        traceback.print_exc()
        raise RuntimeError(f"Gemini API call failed: {str(e)}")