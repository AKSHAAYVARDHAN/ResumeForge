import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ── Multer (file uploads) ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + "-" + file.originalname);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
    fileFilter: (_req, file, cb) => {
        const allowed = ["application/pdf", "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, TXT, DOC, and DOCX files are allowed"));
        }
    },
});

// ── Gemini setup ───────────────────────────────────────────────────────────────
let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini AI initialized");
} else {
    console.warn("⚠️  GEMINI_API_KEY not set — /analyze will use fallback mode");
}

// ── Routes ─────────────────────────────────────────────────────────────────────

// Health check
app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "ResumeForge backend is running" });
});

// POST /upload
app.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("📎 File received:", req.file.originalname, `(${req.file.size} bytes)`);
        res.json({
            message: "File uploaded successfully",
            filename: req.file.originalname,
            storedAs: req.file.filename,
            size: req.file.size,
        });
    } catch (err) {
        console.error("Upload error:", err.message);
        res.status(500).json({ error: "Upload failed", detail: err.message });
    }
});

// POST /analyze
app.post("/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            return res.status(400).json({ error: "Request body must include a non-empty 'text' field" });
        }

        console.log(`🔍 Analyzing resume (${text.length} chars)...`);

        // ── Fallback when Gemini key is missing ────────────────────────────────────
        if (!genAI) {
            return res.json({
                analysis: {
                    ats_score: 70,
                    summary: "Gemini API key not configured. This is a placeholder response.",
                    key_skills: ["JavaScript", "React", "Node.js"],
                    strengths: ["Clear formatting", "Relevant experience listed"],
                    weaknesses: ["Missing quantifiable achievements"],
                    suggestions: ["Add metrics to your achievements", "Include a professional summary"],
                },
            });
        }

        // ── Live Gemini analysis ───────────────────────────────────────────────────
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are an expert ATS (Applicant Tracking System) and resume coach.
Analyze the following resume and respond ONLY with a valid JSON object (no markdown, no code fences) matching exactly this structure:

{
  "ats_score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "key_skills": ["<skill1>", "<skill2>", ...],
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "suggestions": ["<suggestion1>", "<suggestion2>", ...]
}

Resume text:
${text.slice(0, 8000)}`; // Gemini 1.5-flash context window guard

        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim();

        // Strip any accidental markdown fences Gemini might still add
        const jsonString = raw
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            console.warn("Gemini returned non-JSON, wrapping raw text");
            parsed = { analysis: raw };
        }

        res.json({ analysis: parsed });
    } catch (error) {
        console.error("Gemini error:", error.message);
        res.status(500).json({
            error: "Analysis failed",
            detail: error.message,
        });
    }
});

// ── Global error handler ───────────────────────────────────────────────────────
// Catches multer errors (e.g. file too large / wrong type) and any other thrown errors
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err.message);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 ResumeForge backend running on http://localhost:${PORT}`);
    console.log(`   CORS allowed origin: http://localhost:5174\n`);
});