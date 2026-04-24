import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, LayoutDashboard, Upload, History } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', icon: LayoutDashboard, subtitle: 'Resume analytics overview' },
  '/analysis':  { title: 'Analyze Resume', icon: Upload, subtitle: 'AI-powered resume insights' },
  '/history':   { title: 'History', icon: History, subtitle: 'Your past analyses' },
};

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isGuest } = useAuth();
  const location = useLocation();

  const pageInfo = pageTitles[location.pathname] || { title: 'ResumeForge AI', subtitle: '' };
  const PageIcon = pageInfo.icon;

  return (
    <div className="app-layout">
      <div className="noise-overlay" />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main className="main-content">
        {/* Page header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Mobile menu btn */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            {/* Page title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {PageIcon && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.2))',
                  border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PageIcon size={17} color="#60a5fa" />
                </div>
              )}
              <div>
                <h1 style={{
                  margin: 0, fontSize: '18px', fontWeight: 700,
                  color: '#e5e5e5', letterSpacing: '-0.3px', lineHeight: 1.2,
                }}>
                  {pageInfo.title}
                </h1>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                  {pageInfo.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right section — user status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isGuest && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontSize: '11px', fontWeight: 600,
                  color: '#f59e0b',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                }}
              >
                Guest Mode
              </motion.span>
            )}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: 'white',
                }}>
                  {(user?.displayName || user?.email || 'U').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', color: '#9ca3af', display: 'none' }}
                  className="sm:block">
                  {user?.displayName || user?.email?.split('@')[0]}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Page body */}
        <div className="page-body">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
