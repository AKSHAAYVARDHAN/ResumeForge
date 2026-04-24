# ResumeForge AI 🚀

> **Craft Better Resumes with AI** — A production-grade AI-powered Resume Analyzer SaaS

---

## What it does

ResumeForge AI analyzes **any resume from any industry** using OpenAI GPT-4o and returns:

- 🎯 **ATS Score** (0–100) with animated circular indicator
- 🌐 **Domain Detection** (Technology, Healthcare, Finance, Hospitality, etc.)
- 💪 **Resume Strength** (Weak / Moderate / Strong)
- 📊 **Experience Level** (Beginner / Intermediate / Advanced)
- ✅ **Extracted Skills** (dynamically detected)
- ❌ **Missing Skills** (domain-aware gap analysis)
- 🎭 **Role Fit Suggestions** (with match percentages)
- 📋 **Section Analysis** (Summary, Experience, Education, Skills, Projects)
- 💡 **Actionable Improvements** (specific, numbered suggestions)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 + Framer Motion |
| Charts | Recharts |
| Auth | Firebase Authentication |
| Database | Firestore |
| Backend | Python Flask |
| AI | OpenAI GPT-4o |
| PDF Parsing | PyPDF2 |

---

## Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run
python app.py
# → http://localhost:5000
```

### 2. Firebase (Optional — for user accounts & history)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project → Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Download **Service Account JSON** → save as `backend/firebase-service-account.json`
5. Get web config → add to `frontend/.env`

### 3. Frontend

```bash
cd frontend

# Copy and fill in environment variables
copy .env.example .env
# Add VITE_FIREBASE_* values and VITE_API_BASE_URL

# Install and run
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

### `backend/.env`
```
OPENAI_API_KEY=sk-...
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json
```

### `frontend/.env`
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=http://localhost:5000
```

> **Note**: The app works in Guest Mode even without Firebase configured. You only need Firebase if you want user accounts and persistent history.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/upload` | Upload PDF, extract text |
| POST | `/analyze` | AI analysis of resume text |
| GET | `/history?userId=...` | Fetch user's analysis history |

---

## User Modes

| Mode | Auth | Data Storage | History |
|---|---|---|---|
| Signed In | Firebase Email/Password | Firestore | ✅ Permanent |
| Guest | None | localStorage | ⚡ Session only |

---

## Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/auth` | Login / Signup |
| `/dashboard` | Upload + analysis overview |
| `/analysis` | Full detailed report |
| `/history` | Past analyses + comparison |
