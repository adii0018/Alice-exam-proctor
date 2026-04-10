import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const palette = {
  blue:   { accent: '#388bfd', glow: 'rgba(56,139,253,0.18)',  bg: 'rgba(56,139,253,0.07)',  border: 'rgba(56,139,253,0.22)',  bar: '#388bfd' },
  green:  { accent: '#3fb950', glow: 'rgba(63,185,80,0.18)',   bg: 'rgba(63,185,80,0.07)',   border: 'rgba(63,185,80,0.22)',   bar: '#3fb950' },
  purple: { accent: '#a371f7', glow: 'rgba(163,113,247,0.18)', bg: 'rgba(163,113,247,0.07)', border: 'rgba(163,113,247,0.22)', bar: '#a371f7' },
  orange: { accent: '#f0883e', glow: 'rgba(240,136,62,0.18)',  bg: 'rgba(240,136,62,0.07)',  border: 'rgba(240,136,62,0.22)',  bar: '#f0883e' },
};

const lightPalette = {
  blue:   { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
  green:  { accent: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  purple: { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  orange: { accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
};

export default function StatCard({ icon: Icon, label, value, trend, trendValue, color = 'blue' }) {
  const { darkMode } = useTheme();

  if (darkMode) {
    const p = palette[color];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          background: '#161b22',
          border: `1px solid #30363d`,
          borderRadius: 14,
          padding: '20px 20px 18px',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = p.border;
          e.currentTarget.style.boxShadow = `0 0 0 1px ${p.border}, 0 8px 24px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#30363d';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${p.accent}, transparent)`,
          borderRadius: '14px 14px 0 0',
        }} />

        {/* icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: p.bg, border: `1px solid ${p.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
          boxShadow: `0 0 12px ${p.glow}`,
        }}>
          <Icon style={{ width: 18, height: 18, color: p.accent }} />
        </div>

        {/* value */}
        <p style={{
          fontSize: '2rem', fontWeight: 700, color: '#e6edf3',
          lineHeight: 1, marginBottom: 6, letterSpacing: '-0.5px',
        }}>
          {value}
        </p>

        {/* label */}
        <p style={{ fontSize: '0.78rem', fontWeight: 500, color: '#8b949e', marginBottom: trend ? 10 : 0 }}>
          {label}
        </p>

        {/* trend */}
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8, borderTop: '1px solid #21262d' }}>
            {trend === 'up'
              ? <TrendingUp style={{ width: 13, height: 13, color: '#3fb950' }} />
              : <TrendingDown style={{ width: 13, height: 13, color: '#f85149' }} />
            }
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trend === 'up' ? '#3fb950' : '#f85149' }}>{trendValue}</span>
            <span style={{ fontSize: '0.72rem', color: '#6e7681' }}>vs last month</span>
          </div>
        )}
      </motion.div>
    );
  }

  // Light mode
  const lp = lightPalette[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative',
        background: '#fff',
        border: `1px solid #e5e7eb`,
        borderRadius: 14,
        padding: '20px 20px 18px',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = lp.border;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${lp.accent}, transparent)`,
        borderRadius: '14px 14px 0 0',
      }} />

      {/* icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: lp.bg, border: `1px solid ${lp.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <Icon style={{ width: 18, height: 18, color: lp.accent }} />
      </div>

      {/* value */}
      <p style={{
        fontSize: '2rem', fontWeight: 700, color: '#111827',
        lineHeight: 1, marginBottom: 6, letterSpacing: '-0.5px',
      }}>
        {value}
      </p>

      {/* label */}
      <p style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6b7280', marginBottom: trend ? 10 : 0 }}>
        {label}
      </p>

      {/* trend */}
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
          {trend === 'up'
            ? <TrendingUp style={{ width: 13, height: 13, color: '#16a34a' }} />
            : <TrendingDown style={{ width: 13, height: 13, color: '#dc2626' }} />
          }
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trend === 'up' ? '#16a34a' : '#dc2626' }}>{trendValue}</span>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
