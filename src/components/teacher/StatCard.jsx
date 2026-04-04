import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const darkColors = {
  blue:   { bg: 'rgba(56,139,253,0.08)',  border: 'rgba(56,139,253,0.2)',  icon: '#388bfd' },
  purple: { bg: 'rgba(163,113,247,0.08)', border: 'rgba(163,113,247,0.2)', icon: '#a371f7' },
  green:  { bg: 'rgba(46,160,67,0.08)',   border: 'rgba(46,160,67,0.2)',   icon: '#3fb950' },
  orange: { bg: 'rgba(240,136,62,0.08)',  border: 'rgba(240,136,62,0.2)',  icon: '#f0883e' },
};

const lightGradients = {
  blue:   'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green:  'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
};

const lightColors = {
  blue:   { bg: '#ffffff', border: '#d0d7de', icon: '#2da44e', iconBg: 'rgba(45,164,78,0.08)' },
  purple: { bg: '#ffffff', border: '#d0d7de', icon: '#2da44e', iconBg: 'rgba(45,164,78,0.08)' },
  green:  { bg: '#ffffff', border: '#d0d7de', icon: '#2da44e', iconBg: 'rgba(45,164,78,0.08)' },
  orange: { bg: '#ffffff', border: '#d0d7de', icon: '#2da44e', iconBg: 'rgba(45,164,78,0.08)' },
};

export default function StatCard({ icon: Icon, label, value, trend, trendValue, color = 'blue' }) {
  const { darkMode } = useTheme();
  const dc = darkColors[color];
  const lc = lightColors[color];

  if (darkMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: '#161b22',
          border: `1px solid #30363d`,
          borderRadius: 12,
          padding: 24,
          transition: 'all 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = dc.border; e.currentTarget.style.boxShadow = `0 0 0 1px ${dc.border}` }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.boxShadow = 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#8b949e', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>{value}</p>
            {trend && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {trend === 'up'
                  ? <TrendingUp style={{ width: 14, height: 14, color: '#3fb950' }} />
                  : <TrendingDown style={{ width: 14, height: 14, color: '#f85149' }} />
                }
                <span style={{ fontSize: 12, fontWeight: 500, color: trend === 'up' ? '#3fb950' : '#f85149' }}>{trendValue}</span>
                <span style={{ fontSize: 12, color: '#6e7681' }}>vs last month</span>
              </div>
            )}
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            backgroundColor: dc.bg, border: `1px solid ${dc.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ width: 20, height: 20, color: dc.icon }} />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: lc.bg,
        border: `1px solid ${lc.border}`,
        borderRadius: 12,
        padding: 24,
        transition: 'all 0.2s',
        cursor: 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,35,40,0.12)';
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#57606a', marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2328', marginBottom: 8 }}>{value}</p>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {trend === 'up'
                ? <TrendingUp style={{ width: 14, height: 14, color: '#2da44e' }} />
                : <TrendingDown style={{ width: 14, height: 14, color: '#d1242f' }} />
              }
              <span style={{ fontSize: 12, fontWeight: 500, color: trend === 'up' ? '#2da44e' : '#d1242f' }}>{trendValue}</span>
              <span style={{ fontSize: 12, color: '#57606a' }}>vs last month</span>
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          backgroundColor: lc.iconBg, border: `1px solid ${lc.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: 20, height: 20, color: lc.icon }} />
        </div>
      </div>
    </motion.div>
  );
}
