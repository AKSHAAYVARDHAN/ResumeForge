import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function SectionProgressBars({ sections }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const getColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#00d4ff';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const sectionNames = {
    summary: 'Summary / Objective',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills Section',
    projects: 'Projects',
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Object.entries(sections).map(([key, val], i) => {
        const score = val.score || 0;
        const color = getColor(score);
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: val.present ? color : '#6b7280',
                }} />
                <span style={{ fontSize: '13px', color: '#e5e5e5', fontWeight: 500 }}>
                  {sectionNames[key] || key}
                </span>
                {!val.present && (
                  <span style={{ fontSize: '10px', color: '#6b7280', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '999px' }}>
                    Missing
                  </span>
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color }}>{score}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${score}%` } : {}}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            {val.feedback && (
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
                {val.feedback}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
