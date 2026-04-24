import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp, FileText, Upload } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import ATSRing from '../components/ATSRing';
import SectionProgressBars from '../components/SectionProgressBars';
import SkillPieChart from '../components/SkillPieChart';
import RoleMatchBarChart from '../components/RoleMatchBarChart';

const sectionVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { currentAnalysis } = useAnalysis();

  /* ── No analysis yet ── */
  if (!currentAnalysis) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'rgba(107,114,128,0.08)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={32} color="#4b5563" />
          </div>
          <h2 style={{ color: '#e5e5e5', margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>No analysis found</h2>
          <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>Upload a resume from the Dashboard first.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              <Upload size={15} /> Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { analysis, filename } = currentAnalysis;

  return (
    <div>
      {/* File info bar */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: '24px',
          padding: '14px 20px',
          background: 'rgba(0,212,255,0.04)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <FileText size={16} color="#00d4ff" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#e5e5e5' }}>{filename}</span>
        <span style={{ color: '#4b5563' }}>·</span>
        <span className="badge badge-cyan">{analysis.domain}</span>
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6b7280' }}>
          {new Date(currentAnalysis.timestamp).toLocaleString()}
        </span>
      </motion.div>

      {/* Score overview */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.08 }}
        className="glass-highlight"
        style={{ padding: '36px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}
      >
        <ATSRing score={analysis.ats_score} size={170} strokeWidth={14} />
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="badge badge-cyan">{analysis.domain}</span>
            <span className="badge badge-blue">{analysis.experience_level}</span>
            <span className={`badge ${analysis.resume_strength === 'Strong' ? 'badge-green' : analysis.resume_strength === 'Moderate' ? 'badge-yellow' : 'badge-red'}`}>
              {analysis.resume_strength}
            </span>
          </div>
          {analysis.summary_insight && (
            <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
              {analysis.summary_insight}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section completeness */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.14 }}
        className="glass"
        style={{ padding: '28px', marginBottom: '20px' }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={17} color="#00d4ff" /> Section Completeness
        </h2>
        <SectionProgressBars sections={analysis.section_analysis} />
      </motion.div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {[
          { title: 'Skill Distribution', comp: <SkillPieChart skills={analysis.extracted_skills} />, delay: 0.2 },
          { title: 'Role Fit Analysis', comp: <RoleMatchBarChart roles={analysis.role_fit} />, delay: 0.25 },
        ].map(({ title, comp, delay }) => (
          <motion.div
            key={title}
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            transition={{ delay }}
            className="glass"
            style={{ padding: '24px' }}
          >
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 18px' }}>{title}</h2>
            {comp}
          </motion.div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Detected */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="glass"
          style={{ padding: '24px' }}
        >
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} color="#10b981" /> Detected Skills
            <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280', marginLeft: 'auto' }}>
              {analysis.extracted_skills?.length} found
            </span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {analysis.extracted_skills?.map(skill => (
              <motion.span key={skill} whileHover={{ scale: 1.05 }} className="badge badge-blue" style={{ cursor: 'default', fontSize: '11px' }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Missing */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.35 }}
          className="glass"
          style={{ padding: '24px' }}
        >
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#ef4444" /> Missing Skills
            <span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280', marginLeft: 'auto' }}>
              {analysis.missing_skills?.length} gaps
            </span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {analysis.missing_skills?.map(skill => (
              <motion.span key={skill} whileHover={{ scale: 1.05 }} className="badge badge-red" style={{ cursor: 'default', fontSize: '11px' }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actionable suggestions */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="glass"
        style={{ padding: '28px', marginBottom: '20px' }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="#f59e0b" /> Actionable Improvements
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {analysis.actionable_suggestions?.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.025)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '7px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(37,99,235,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '11px', fontWeight: 700, color: '#00d4ff',
              }}>
                {i + 1}
              </div>
              <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{s}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Role fit table */}
      <motion.div
        variants={sectionVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
        className="glass"
        style={{ padding: '28px' }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#2563eb" /> Role Fit Breakdown
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analysis.role_fit?.map((role, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '180px', fontSize: '13px', color: '#e5e5e5', fontWeight: 500, flexShrink: 0 }}>{role.role}</div>
              <div className="progress-bar" style={{ flex: 1 }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${role.match_percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div style={{ width: '40px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#00d4ff', flexShrink: 0 }}>
                {role.match_percentage}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
