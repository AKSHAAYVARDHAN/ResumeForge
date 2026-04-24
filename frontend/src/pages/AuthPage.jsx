import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, logout, continueAsGuest, isFirebaseReady, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect already-authenticated users straight to the dashboard
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isFirebaseReady) {
      setError('Firebase is not configured. Add your Firebase credentials to the .env file to enable authentication. You can still use Guest Mode.');
      return;
    }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
      navigate('/dashboard');
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    // If currently signed in, sign out first so the two states don't conflict
    await logout();
    continueAsGuest();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Back */}
        <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '24px', padding: '8px 0', fontSize: '13px' }}>
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="glass" style={{ padding: '40px 36px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00d4ff, #2563eb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,212,255,0.3)' }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#e5e5e5' }}>
              ResumeForge <span style={{ color: '#00d4ff' }}>AI</span>
            </span>
          </div>

          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '28px' }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  background: mode === m ? 'rgba(0,212,255,0.15)' : 'transparent',
                  color: mode === m ? '#00d4ff' : '#9ca3af',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: mode === m ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>
                    <User size={13} style={{ display: 'inline', marginRight: '6px' }} />Full Name
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>
                  <Mail size={13} style={{ display: 'inline', marginRight: '6px' }} />Email
                </label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px', display: 'block' }}>
                  <Lock size={13} style={{ display: 'inline', marginRight: '6px' }} />Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#f87171', fontSize: '13px' }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="divider" />

          <button
            className="btn-secondary"
            onClick={handleGuest}
            style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}
          >
            Continue as Guest
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '10px' }}>
            No account needed · Data stored locally
          </p>
        </div>
      </motion.div>
    </div>
  );
}
