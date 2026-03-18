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

export default function StatCard({ icon: Icon, label, value, trend, trendValue, color = 'blue' }) {
  const { darkMode } = useTheme();
  const dc = darkColors[color];

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
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend === 'up'
                ? <TrendingUp className="w-4 h-4 text-green-600" />
                : <TrendingDown className="w-4 h-4 text-red-600" />
              }
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trendValue}</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${lightGradients[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
