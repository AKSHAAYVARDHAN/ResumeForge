import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, hasConfig } from '../config/firebase';

const AuthContext = createContext(null);

// ── Friendly Firebase error messages ────────────────────────────────────────
function friendlyError(err) {
  const code = err?.code || '';
  const map = {
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/invalid-credential':   'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/too-many-requests':    'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/operation-not-allowed':  'Email/password auth is not enabled in Firebase console.',
  };
  return map[code] || err?.message || 'Authentication failed. Please try again.';
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, skip subscription and go straight to ready
    if (!auth || !hasConfig) {
      console.warn('[AuthContext] Firebase not configured — guest-only mode active.');
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) setIsGuest(false); // clear guest flag on successful sign-in
      setLoading(false);
    });

    return unsub; // cleanup listener on unmount
  }, []);

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = async (email, password, displayName = '') => {
    if (!auth || !hasConfig) {
      throw new Error('Firebase is not configured. Please add your Firebase credentials.');
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      return cred;
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    if (!auth || !hasConfig) {
      throw new Error('Firebase is not configured. Please add your Firebase credentials.');
    }
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      if (auth && hasConfig) await signOut(auth);
    } catch (err) {
      console.warn('[AuthContext] Sign-out error:', err.message);
    } finally {
      setUser(null);
      setIsGuest(false);
    }
  };

  // ── guest mode ─────────────────────────────────────────────────────────────
  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  // ── derived state ──────────────────────────────────────────────────────────
  const isAuthenticated  = !!user;
  const isFirebaseReady  = hasConfig && !!auth;

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      isAuthenticated,
      isFirebaseReady,
      loading,
      signup,
      login,
      logout,
      continueAsGuest,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
