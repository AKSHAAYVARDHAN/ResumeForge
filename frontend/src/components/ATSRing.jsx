import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ATSRing({ score = 0, size = 200, strokeWidth = 14 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981'; // green
    if (s >= 60) return '#00d4ff'; // cyan
    if (s >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Work';
  };

  // Animate score counter
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = clampedScore / 60; // ~1 sec at 60fps
    const interval = setInterval(() => {
      start += step;
      if (start >= clampedScore) {
        setDisplayScore(clampedScore);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [inView, clampedScore]);

  const color = getColor(clampedScore);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            color,
            lineHeight: 1,
            textShadow: `0 0 20px ${color}66`,
          }}>
            {displayScore}
          </span>
          <span style={{ fontSize: size * 0.1, color: '#9ca3af', marginTop: '2px' }}>/ 100</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {getLabel(clampedScore)}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>ATS Score</div>
      </div>
    </div>
  );
}
