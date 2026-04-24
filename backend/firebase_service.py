import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

_db = None


def get_db():
    global _db
    if _db is None:
        creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-service-account.json")
        if not firebase_admin._apps:
            if os.path.exists(creds_path):
                cred = credentials.Certificate(creds_path)
                firebase_admin.initialize_app(cred)
            else:
                # Firebase not configured — skip Firestore
                return None
        _db = firestore.client()
    return _db


def save_analysis(user_id: str, resume_text: str, analysis: dict, filename: str) -> str:
    """Save analysis result to Firestore. Returns document ID."""
    db = get_db()
    if db is None:
        raise RuntimeError("Firebase is not configured. Please add firebase-service-account.json.")

    import datetime
    doc_ref = db.collection("analyses").document()
    doc_data = {
        "userId": user_id,
        "filename": filename,
        "resumeText": resume_text[:2000],  # Store first 2k chars as preview
        "analysis": analysis,
        "atsScore": analysis.get("ats_score", 0),
        "domain": analysis.get("domain", "Unknown"),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    doc_ref.set(doc_data)
    return doc_ref.id


def get_history(user_id: str) -> list:
    """Fetch all past analyses for a user from Firestore."""
    db = get_db()
    if db is None:
        return []

    docs = (
        db.collection("analyses")
        .where("userId", "==", user_id)
        .order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(20)
        .stream()
    )
    results = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)
    return results
