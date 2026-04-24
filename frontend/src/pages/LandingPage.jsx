import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Upload, Brain, BarChart3, Shield, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Brain, title: 'Universal AI Analysis', desc: 'Works for any domain — tech, finance, healthcare, marketing, hospitality, and more. No hardcoded rules.' },
  { icon: BarChart3, title: 'ATS Score & Insights', desc: 'Get your ATS compatibility score, section-by-section feedback, and skill gap analysis instantly.' },
  { icon: Upload, title: 'Drag & Drop Upload', desc: 'Simply drag your PDF resume and our AI does the rest — extraction, analysis, visualization.' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your resume data is encrypted and never shared. Guest mode available — no signup required.' },
];

const stats = [
  { value: '50+', label: 'Industries Supported' },
  { value: '99%', label: 'PDF Compatibility' },
  { value: '< 15s', label: 'Analysis Time' },
  { value: '100%', label: 'AI-Powered' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Software Engineer', text: 'ResumeForge caught skills I was missing and helped me land 3x more interviews!', stars: 5 },
  { name: 'Marcus T.', role: 'Marketing Manager', text: 'Finally an AI tool that actually understands marketing resumes, not just tech ones.', stars: 5 },
  { name: 'Dr. Priya M.', role: 'Healthcare Professional', text: 'The domain-aware analysis is incredible — it knew exactly what a clinical resume needs.', stars: 5 },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest, continueAsGuest } = useAuth();

  const handleAnalyze = () => {
    if (isAuthenticated || isGuest) {
      navigate('/dashboard');
    } else {
      continueAsGuest();
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', overflowX: 'hidden' }}>

      {/* Background glow blobs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '30%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)',
        }} />
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container-app">
          <motion.div
            {...fadeUp}
            style={{ marginBottom: '20px' }}
          >
            <span className="badge badge-cyan" style={{ fontSize: '12px' }}>
              <Zap size={12} /> Powered by GPT-4o
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: 'clamp(40px, 7vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              margin: '0 0 24px',
              color: '#e5e5e5',
            }}
          >
            Craft Better Resumes
            <br />
            <span className="gradient-text">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: '#9ca3af',
              maxWidth: '580px',
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Upload your resume and get instant, domain-aware AI analysis with ATS scoring,
            skill gaps, role fit suggestions, and actionable improvements — for any industry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn-primary" onClick={handleAnalyze} style={{ fontSize: '16px', padding: '14px 32px' }}>
              <Upload size={18} /> Analyze Resume
            </button>
            <button className="btn-secondary" onClick={() => navigate('/auth')} style={{ fontSize: '16px', padding: '14px 32px' }}>
              Sign In <ArrowRight size={18} />
            </button>
            <button className="btn-ghost" onClick={handleAnalyze} style={{ fontSize: '15px' }}>
              Continue as Guest
            </button>
          </motion.div>

          {/* Floating mockup preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ marginTop: '72px', position: 'relative', maxWidth: '900px', margin: '72px auto 0' }}
          >
            <div className="glass-highlight animate-float" style={{
              padding: '32px',
              background: 'rgba(16,16,16,0.8)',
              boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.08)',
            }}>
              {/* Mock dashboard UI */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'ATS Score', value: '87', color: '#10b981' },
                  { label: 'Domain', value: 'Technology', color: '#00d4ff' },
                  { label: 'Strength', value: 'Strong', color: '#2563eb' },
                ].map(card => (
                  <div key={card.label} className="glass" style={{ padding: '16px', textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{card.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: card.color }}>{card.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>Skills Detected</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['React', 'Python', 'AWS', 'SQL', 'Docker', 'Node.js'].map(s => (
                      <span key={s} className="badge badge-blue" style={{ fontSize: '10px' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="glass" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>Missing Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['Kubernetes', 'TypeScript', 'GraphQL'].map(s => (
                      <span key={s} className="badge badge-red" style={{ fontSize: '10px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-app">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#00d4ff', marginBottom: '8px' }}>{value}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 0' }}>
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', margin: '0 0 16px', color: '#e5e5e5' }}>
              Everything you need to <span className="gradient-text">stand out</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
              AI-powered insights tailored to your industry, not generic advice.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass"
                style={{ padding: '32px', cursor: 'default' }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.15))',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}>
                  <Icon size={24} color="#00d4ff" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-app">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '48px', color: '#e5e5e5' }}
          >
            Loved by professionals across industries
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {testimonials.map(({ name, role, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass"
                style={{ padding: '28px' }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {Array.from({ length: stars }).map((_, si) => (
                    <Star key={si} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{text}"</p>
                <div>
                  <div style={{ fontWeight: 600, color: '#e5e5e5', fontSize: '14px' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 0', textAlign: 'center' }}>
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-highlight"
            style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 16px', color: '#e5e5e5' }}>
              Ready to forge your <span className="gradient-text">perfect resume?</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '17px', marginBottom: '40px' }}>
              Start analyzing for free. No credit card required.
            </p>
            <button className="btn-primary" onClick={handleAnalyze} style={{ fontSize: '17px', padding: '16px 40px' }}>
              <Zap size={20} /> Analyze My Resume Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', textAlign: 'center' }}>
        <div className="container-app">
          <div style={{ color: '#6b7280', fontSize: '13px' }}>
            © 2026 <span style={{ color: '#00d4ff', fontWeight: 600 }}>ResumeForge AI</span> · Craft Better Resumes with AI
          </div>
        </div>
      </footer>
    </div>
  );
}
