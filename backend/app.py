import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from resume_parser import parse_pdf
from ai_engine import analyze_resume
from firebase_service import save_analysis, get_history

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


# ── Health ─────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ResumeForge AI Backend"})


# ── Upload ─────────────────────────────────────────────────────────────────────
@app.route("/upload", methods=["POST"])
def upload():
    """
    Upload a PDF resume and extract its text.
    Returns: { success, text, filename, char_count }
    """
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    file_bytes = file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File size exceeds 5 MB limit"}), 400

    try:
        text = parse_pdf(file_bytes)
        if not text or len(text.strip()) < 50:
            return jsonify({"error": "Could not extract readable text from PDF. Try a text-based PDF."}), 422

        print(f"[upload] Extracted {len(text)} chars from '{file.filename}'")
        return jsonify({
            "success": True,
            "text": text,
            "filename": file.filename,
            "char_count": len(text),
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"PDF parsing failed: {str(e)}"}), 422


# ── Analyze ────────────────────────────────────────────────────────────────────
@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Analyze resume text using Gemini AI.
    Body: { text: str, userId?: str, filename?: str }
    Returns: { success, analysis, saved, docId }
    """
    # 1. Parse request body
    try:
        data = request.get_json(force=True, silent=True)
    except Exception:
        data = None

    if not data or "text" not in data:
        return jsonify({"error": "Request body must contain a 'text' field with the resume content."}), 400

    resume_text = data.get("text", "")
    user_id     = data.get("userId")          # Optional -- guests won't send this
    filename    = data.get("filename", "resume.pdf")

    if not resume_text or len(resume_text.strip()) < 50:
        return jsonify({"error": "Resume text is too short. Please upload a proper resume PDF."}), 400

    # 2. Run AI analysis
    try:
        print(f"[analyze] Starting analysis for '{filename}' (userId={user_id or 'guest'})")
        analysis = analyze_resume(resume_text)
        print(f"[analyze] Analysis complete -- ATS score: {analysis.get('ats_score', '?')}")
    except ValueError as e:
        # Input validation errors (e.g. text too short)
        print(f"[analyze] Validation error: {e}")
        return jsonify({"error": str(e)}), 400
    except RuntimeError as e:
        # AI / JSON parsing errors -- already logged inside ai_engine
        print(f"[analyze] RuntimeError: {e}")
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        # Catch-all -- always return JSON, never an HTML 500 page
        print(f"[analyze] Unexpected exception:")
        traceback.print_exc()
        return jsonify({"error": f"An unexpected server error occurred: {str(e)}"}), 500

    # 3. Persist to Firestore (non-fatal -- guests skip this)
    doc_id = None
    if user_id:
        try:
            doc_id = save_analysis(user_id, resume_text, analysis, filename)
            print(f"[analyze] Saved to Firestore: {doc_id}")
        except Exception as fb_err:
            # Non-fatal -- analysis still succeeds even if Firestore is unavailable
            print(f"[analyze] Firestore save failed (non-fatal): {fb_err}")

    return jsonify({
        "success": True,
        "analysis": analysis,
        "saved": doc_id is not None,
        "docId": doc_id,
    })


# ── History ────────────────────────────────────────────────────────────────────
@app.route("/history", methods=["GET"])
def history():
    """
    Get resume analysis history for a user.
    Query param: userId (required for authenticated users)
    Returns: { success, history: [...] }
    """
    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "'userId' query parameter is required"}), 400

    try:
        records = get_history(user_id)
        return jsonify({"success": True, "history": records})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Could not fetch history: {str(e)}"}), 500


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port  = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    print(f"ResumeForge AI Backend starting on http://localhost:{port}")
    print(f"Debug mode: {debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)
