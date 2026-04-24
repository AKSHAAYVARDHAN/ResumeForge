import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, FileText, GitCompare, Info, Upload, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import { SkeletonLine } from '../components/SkeletonLoader';

function ScoreDot({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#00d4ff' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%',
      border: `2.5px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${color}0f`,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#e5e5e5' }}>{score}</span>
    </div>
  );
}

function HistoryCard({ record, onSelect, selected, comparing, onCompare, index }) {
  const a = record.analysis;
  const strengthColor = a.resume_strength === 'Strong' ? '#10b981' : a.resume_strength === 'Moderate' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => onSelect(record)}
      whileHover={{ y: -2 }}
      style={{
        padding: '20px',
        borderRadius: '14px',
        border: selected
          ? '1px solid rgba(0,212,255,0.45)'
          : comparing
          ? '1px solid rgba(147,51,234,0.4)'
          : '1px solid rgba(255,255,255,0.07)',
        background: selected
          ? 'rgba(0,212,255,0.05)'
          : comparing
          ? 'rgba(147,51,234,0.05)'
          : 'rgba(22,22,22,0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
          <div style={{
            fontSize: '14px', fontWeight: 600, color: '#e5e5e5',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: '4px',
          }}>
            {record.filename || 'Resume'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '11px' }}>
            <Clock size={11} />
            {new Date(record.timestamp).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>
        <ScoreDot score={a.ats_score} />
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{
          fontSize: '10px', color: '#00d4ff',
          background: 'rgba(0,212,255,0.08)', padding: '3px 9px',
          borderRadius: '999px', border: '1px solid rgba(0,212,255,0.18)', fontWeight: 600,
        }}>{a.domain}</span>
        <span style={{
          fontSize: '10px', color: strengthColor,
          background: `${strengthColor}10`, padding: '3px 9px',
          borderRadius: '999px', fontWeight: 600,
        }}>{a.resume_strength}</span>
        {onCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); onCompare(record); }}
            title="Compare"
            style={{
              marginLeft: 'auto',
              background: 'none', border: 'none', cursor: 'pointer',
              color: comparing ? '#c084fc' : '#4b5563', padding: '2px', lineHeight: 0,
              transition: 'color 0.2s',
            }}
          >
            <GitCompare size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function CompareView({ a, b }) {
  if (!a || !b) return null;
  const rows = [
    { label: 'ATS Score', va: a.analysis.ats_score, vb: b.analysis.ats_score },
    { label: 'Domain', va: a.analysis.domain, vb: b.analysis.domain },
    { label: 'Strength', va: a.analysis.resume_strength, vb: b.analysis.resume_strength },
    { label: 'Experience', va: a.analysis.experience_level, vb: b.analysis.experience_level },
    { label: 'Skills Found', va: a.analysis.extracted_skills?.length, vb: b.analysis.extracted_skills?.length },
    { label: 'Missing Skills', va: a.analysis.missing_skills?.length, vb: b.analysis.missing_skills?.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ padding: '24px', marginTop: '20px' }}
    >
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e5e5e5', margin: '0 0 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <GitCompare size={16} color="#c084fc" /> Side-by-Side Comparison
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '11px', color: '#6b7280', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Metric</div>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#00d4ff', padding: '8px 14px', borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,212,255,0.02)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {a.filename?.slice(0, 22) || 'Resume A'}
        </div>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#c084fc', padding: '8px 14px', borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(147,51,234,0.02)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {b.filename?.slice(0, 22) || 'Resume B'}
        </div>
        {rows.map(({ label, va, vb }, i) => (
          <>
            <div key={`l${i}`} style={{ padding: '11px 0', fontSize: '13px', color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.05)' }}>{label}</div>
            <div key={`a${i}`} style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#e5e5e5', borderTop: '1px solid rgba(255,255,255,0.05)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>{va}</div>
            <div key={`b${i}`} style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#e5e5e5', borderTop: '1px solid rgba(255,255,255,0.05)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>{vb}</div>
          </>
        ))}
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { history, fetchHistory, setCurrentAnalysis } = useAnalysis();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  useEffect(() => {
    const load = async () => {
      await fetchHistory();
      setLoading(false);
    };
    load();
  }, [fetchHistory]);

  const handleSelect = (record) => {
    setSelected(record);
    setCurrentAnalysis(record);
    navigate('/analysis');
  };

  const handleCompare = (record) => {
    if (!compareA || (compareA && compareB)) {
      setCompareA(record); setCompareB(null);
    } else {
      setCompareB(record);
    }
  };

  const isComparing = (record) => compareA?.id === record.id || compareB?.id === record.id;

  /* Stats summary */
  const avgScore = history.length
    ? Math.round(history.reduce((s, r) => s + r.analysis.ats_score, 0) / history.length)
    : null;
  const bestScore = history.length
    ? Math.max(...history.map(r => r.analysis.ats_score))
    : null;

  return (
    <div>
      {/* Guest notice */}
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '20px', padding: '12px 16px',
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
            color: '#fbbf24', fontSize: '13px',
          }}
        >
          <Info size={15} style={{ flexShrink: 0 }} />
          Guest history is stored locally and cleared on browser reset.{' '}
          <span style={{ color: '#e5e5e5', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/auth')}>
            Sign in to save permanently.
          </span>
        </motion.div>
      )}

      {/* Summary stats */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}
        >
          {[
            { label: 'Resumes Analyzed', value: history.length, icon: FileText, color: '#00d4ff' },
            { label: 'Average ATS Score', value: avgScore, icon: TrendingUp, color: '#10b981' },
            { label: 'Best ATS Score', value: bestScore, icon: TrendingUp, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: `${color}12`, border: `1px solid ${color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#e5e5e5', letterSpacing: '-0.5px' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Compare hint */}
      <AnimatePresence>
        {history.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'rgba(147,51,234,0.07)', border: '1px solid rgba(147,51,234,0.18)',
              borderRadius: '8px', fontSize: '12px', color: '#c084fc',
              display: 'flex', alignItems: 'center', gap: '7px',
            }}
          >
            <GitCompare size={13} />
            Click the <GitCompare size={11} style={{ display: 'inline' }} /> icon on any two resumes to compare them side-by-side.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass" style={{ padding: '20px' }}>
              <SkeletonLine width="45%" height={14} />
              <div style={{ marginTop: '8px' }}><SkeletonLine width="28%" height={11} /></div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <SkeletonLine width="80px" height={20} />
                <SkeletonLine width="64px" height={20} />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={30} color="#4b5563" />
          </div>
          <h3 style={{ color: '#e5e5e5', margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>No analyses yet</h3>
          <p style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '14px' }}>Upload your first resume to get AI-powered insights.</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            <Upload size={15} /> Analyze a Resume <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
            {history.map((record, i) => (
              <HistoryCard
                key={record.id || i}
                record={record}
                index={i}
                selected={selected?.id === record.id}
                comparing={isComparing(record)}
                onSelect={handleSelect}
                onCompare={history.length >= 2 ? handleCompare : null}
              />
            ))}
          </div>

          {compareA && compareB && <CompareView a={compareA} b={compareB} />}
          {compareA && !compareB && (
            <div style={{ marginTop: '14px', padding: '11px 16px', background: 'rgba(147,51,234,0.07)', borderRadius: '10px', color: '#c084fc', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <GitCompare size={13} /> Resume A selected. Now pick a second resume to compare.
            </div>
          )}
        </>
      )}
    </div>
  );
}
