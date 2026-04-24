import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AnalysisContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const GUEST_HISTORY_KEY = 'resumeforge_guest_history';

export function AnalysisProvider({ children }) {
  const { user, isGuest } = useAuth();
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Upload PDF → returns extracted text
  const uploadResume = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(`${API_BASE}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data; // { success, text, filename, char_count }
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Is the backend running?';
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  }, []);

  // Send text to AI for analysis
  const analyzeText = useCallback(async (text, filename) => {
    setAnalyzing(true);
    setError(null);
    try {
      const payload = {
        text,
        filename,
        userId: user?.uid || null,
      };
      const res = await axios.post(`${API_BASE}/analyze`, payload);
      const analysis = res.data.analysis;

      const record = {
        id: res.data.docId || `guest_${Date.now()}`,
        filename,
        analysis,
        atsScore: analysis.ats_score,
        domain: analysis.domain,
        timestamp: new Date().toISOString(),
      };

      setCurrentAnalysis(record);

      // Store in localStorage for guests
      if (isGuest || !user) {
        const existing = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || '[]');
        const updated = [record, ...existing].slice(0, 10); // Keep last 10
        localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(updated));
        setHistory(updated);
      }

      return record;
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setAnalyzing(false);
    }
  }, [user, isGuest]);

  // Fetch history from backend (signed-in) or localStorage (guest)
  const fetchHistory = useCallback(async () => {
    if (user?.uid) {
      try {
        const res = await axios.get(`${API_BASE}/history`, {
          params: { userId: user.uid },
        });
        setHistory(res.data.history || []);
      } catch {
        setHistory([]);
      }
    } else {
      const stored = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || '[]');
      setHistory(stored);
    }
  }, [user]);

  const clearError = () => setError(null);

  return (
    <AnalysisContext.Provider value={{
      currentAnalysis,
      setCurrentAnalysis,
      history,
      uploading,
      analyzing,
      error,
      clearError,
      uploadResume,
      analyzeText,
      fetchHistory,
    }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used inside AnalysisProvider');
  return ctx;
};
