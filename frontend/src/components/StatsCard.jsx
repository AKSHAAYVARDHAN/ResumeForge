import { motion } from 'framer-motion';

/**
 * Reusable metric / stats card for the dashboard top row.
 *
 * Props:
 *   label     – string  e.g. "ATS Score"
 *   value     – string|number  e.g. 82 or "Strong"
 *   sub       – ReactNode  optional sub-label (badge, small text)
 *   icon      – Lucide icon component
 *   iconColor – hex/rgba string
 *   accent    – hex/rgba for the icon background tint
 *   index     – number for staggered animation delay
 */
export default function StatsCard({ label, value, sub, icon: Icon, iconColor = '#00d4ff', accent, index = 0 }) {
  return (
    <motion.div
      className="glass stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: accent || `${iconColor}18`,
          border: `1px solid ${iconColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {Icon && <Icon size={17} color={iconColor} />}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#e5e5e5', letterSpacing: '-0.5px', lineHeight: 1 }}>
        {value}
      </div>

      {/* Sub label */}
      {sub && (
        <div>{sub}</div>
      )}
    </motion.div>
  );
}
