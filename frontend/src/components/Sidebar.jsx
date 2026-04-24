import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, Upload, History, LogOut,
  User, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & metrics' },
  { to: '/analysis', label: 'Analyze Resume', icon: Upload, description: 'Upload & inspect' },
  { to: '/history', label: 'History', icon: History, description: 'Past analyses' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, isGuest, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onClose?.();
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link
            to="/"
            onClick={onClose}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: '38px', height: '38px',
                background: 'linear-gradient(135deg, #00d4ff, #2563eb)',
                borderRadius: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                flexShrink: 0,
              }}
            >
              <Zap size={20} color="white" fill="white" />
            </motion.div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#e5e5e5', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                ResumeForge
              </div>
              <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 600, letterSpacing: '0.5px' }}>
                AI
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>

          {navItems.map(({ to, label, icon: Icon, description }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={to}
                onClick={onClose}
                className={`sidebar-item ${isActive(to) ? 'sidebar-item-active' : ''}`}
              >
                <Icon
                  size={18}
                  className="sidebar-icon"
                  style={{ color: isActive(to) ? '#60a5fa' : '#6b7280' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{label}</div>
                  {!isActive(to) && (
                    <div style={{ fontSize: '11px', color: '#4b5563', lineHeight: 1 }}>{description}</div>
                  )}
                </div>
                {isActive(to) && (
                  <ChevronRight size={14} style={{ color: '#60a5fa', flexShrink: 0 }} />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          {/* Guest mode banner */}
          {isGuest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '8px 10px',
                background: 'rgba(245,158,11,0.07)',
                border: '1px solid rgba(245,158,11,0.18)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontSize: '11px',
                color: '#f59e0b',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '14px' }}>👤</span>
              <div>
                <div style={{ fontWeight: 600 }}>Guest Mode</div>
                <Link
                  to="/auth"
                  onClick={onClose}
                  style={{ color: '#fbbf24', textDecoration: 'underline', fontSize: '10px' }}
                >
                  Sign in to save results
                </Link>
              </div>
            </motion.div>
          )}

          {/* User info */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {isAuthenticated ? initials : <User size={16} />}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{
                fontSize: '13px', fontWeight: 600, color: '#e5e5e5',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {isAuthenticated ? displayName : 'Guest User'}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {isAuthenticated ? user?.email?.split('@')[0] + '@...' : 'Not signed in'}
              </div>
            </div>
          </div>

          {/* Auth actions */}
          {isAuthenticated ? (
            <button
              className="sidebar-item"
              onClick={handleLogout}
              style={{ color: '#ef4444', width: '100%' }}
            >
              <LogOut size={16} className="sidebar-icon" style={{ color: '#ef4444' }} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px 16px' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
