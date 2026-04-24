import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart2, Star, Target, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import UploadCard from '../components/UploadCard';
import ATSRing from '../components/ATSRing';
import StatsCard from '../components/StatsCard';
import SkillPieChart from '../components/SkillPieChart';
import RoleMatchBarChart from '../components/RoleMatchBarChart';

const getStrengthBadge = (s) => {
  if (s === 'Strong') return 'badge-green';
  if (s === 'Moderate') return 'badge-yellow';
  return 'badge-red';
};

const getLevelBadge = (l) => {
  if (l === 'Advanced') return 'badge-cyan';
  if (l === 'Intermediate') return 'badge-blue';
  return 'badge-purple';
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { uploadResume, analyzeText, currentAnalysis, uploading, analyzing, error, clearError } = useAnalysis();
  const [localError, setLocalError] = useState('');

  const isLoading = uploading || analyzing;
  const analysis = currentAnalysis?.analysis;

  const handleFile = async (file) => {
    setLocalError('');
    clearError();
    try {
      const result = await uploadResume(file);
      await analyzeText(result.text, result.filename);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const displayError = error || localError;

  /* ── Empty state ── */
  if (!analysis) {
    return (
      <UploadCard
        onFile={handleFile}
        loading={isLoading}
        uploading={uploading}
        analyzing={analyzing}
        error={displayError}
      />
    );
  }

  /* ── Loaded state ── */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

      {/* Welcome bar */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#e5e5e5', letterSpacing: '-0.3px' }}>
            {isAuthenticated ? `Welcome back, ${user?.displayName || user?.email?.split('@')[0]} 👋` : 'Resume Dashboard'}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            Analysis for: <span style={{ color: '#00d4ff' }}>{currentAnalysis?.filename}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => navigate('/analysis')} style={{ fontSize: '13px', padding: '10px 18px' }}>
            Full Report <ArrowRight size={15} />
          </button>
          <button className="btn-ghost" onClick={() => window.location.reload()} style={{ fontSize: '13px' }}>
            New Resume
          </button>
        </div>
      </div>

      {/* ── Top metrics row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '16px', marginBottom: '20px', alignItems: 'stretch' }}>

        {/* ATS Ring */}
        <motion.div
          className="glass-highlight stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '175px' }}
        >
          <ATSRing score={analysis.ats_score} size={150} />
        </motion.div>

        {/* Domain */}
        <StatsCard
          index={1}
          label="Industry Domain"
          value={analysis.domain}
          icon={Target}
          iconColor="#00d4ff"
          sub={<span className={`badge ${getLevelBadge(analysis.experience_level)}`}>{analysis.experience_level}</span>}
        />

        {/* Strength */}
        <StatsCard
          index={2}
          label="Resume Strength"
          value={analysis.resume_strength}
          icon={Star}
          iconColor="#f59e0b"
          sub={<span className={`badge ${getStrengthBadge(analysis.resume_strength)}`}>{analysis.resume_strength}</span>}
        />

        {/* Skills */}
        <StatsCard
          index={3}
          label="Skills Found"
          value={analysis.extracted_skills?.length || 0}
          icon={Layers}
          iconColor="#10b981"
          sub={
            <span className="badge badge-red" style={{ fontSize: '10px' }}>
              {analysis.missing_skills?.length || 0} missing
            </span>
          }
        />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={16} color="#9333ea" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>Skill Distribution</h3>
          </div>
          <SkillPieChart skills={analysis.extracted_skills} />
        </motion.div>

        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={16} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>Role Fit Analysis</h3>
          </div>
          <RoleMatchBarChart roles={analysis.role_fit} />
        </motion.div>
      </div>

      {/* ── Skills row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#e5e5e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✅ Detected Skills
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: '#6b7280' }}>
              {analysis.extracted_skills?.length} found
            </span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {analysis.extracted_skills?.map(skill => (
              <motion.span key={skill} whileHover={{ scale: 1.06 }} className="badge badge-blue" style={{ cursor: 'default', fontSize: '11px' }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#e5e5e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🎯 Missing Skills
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: '#6b7280' }}>
              {analysis.missing_skills?.length} gaps
            </span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {analysis.missing_skills?.map(skill => (
              <motion.span key={skill} whileHover={{ scale: 1.06 }} className="badge badge-red" style={{ cursor: 'default', fontSize: '11px' }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── AI Summary ── */}
      {analysis.summary_insight && (
        <motion.div
          className="glass-highlight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ padding: '24px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.2))',
            border: '1px solid rgba(0,212,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={18} color="#00d4ff" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>AI Summary</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px', lineHeight: 1.75 }}>{analysis.summary_insight}</p>
          </div>
        </motion.div>
      )}

      {/* ── CTA ── */}
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <button className="btn-primary" onClick={() => navigate('/analysis')} style={{ fontSize: '14px', padding: '12px 28px' }}>
          View Full Analysis Report <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
