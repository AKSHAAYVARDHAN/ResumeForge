import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ── Config ─────────────────────────────────────────────────────────────────
// Values come from Vite env vars (preferred) with the project's real credentials
// as a fallback so the app works even if .env is empty.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyAQ0ITFF9VY_Lnb7H4LQ6MiEy79DTQyy0k',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'ai-resume-analyzer-5116f.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'ai-resume-analyzer-5116f',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'ai-resume-analyzer-5116f.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '633026283009',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:633026283009:web:77de8bd4d2a7865fb22200',
};

// ── hasConfig guard ─────────────────────────────────────────────────────────
// True when the three fields Firebase Auth strictly requires are present.
export const hasConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

// ── Initialize ──────────────────────────────────────────────────────────────
let app  = null;
export let auth = null;

if (hasConfig) {
  try {
    app  = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('[firebase] Initialization failed:', err.message);
  }
} else {
  console.warn('[firebase] Config incomplete — running in guest-only mode.');
}

export default app;
