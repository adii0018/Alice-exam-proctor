import { motion } from 'framer-motion'
import { FiTrendingUp, FiAward, FiClock, FiTarget } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'

const QuickStats = ({ stats = null }) => {
  const { darkMode } = useTheme()

  const safe = stats || {
    total_attempts: 0,
    average_score: 0,
    pass_rate: 0,
    total_time_hours: 0,
  }

  const cards = [
    {
      icon: FiAward,
      label: 'Total Exams',
      value: String(safe.total_attempts),
      change: safe.total_attempts === 1 ? '1 attempt' : `${safe.total_attempts} attempts`,
      color: '#059669',
      darkBg: 'rgba(59,130,246,0.08)',
      darkBorder: 'rgba(59,130,246,0.2)',
    },
    {
      icon: FiTrendingUp,
      label: 'Average Score',
      value: `${Number(safe.average_score || 0).toFixed(1)}%`,
      change: 'Average across attempts',
      color: '#2ea043',
      darkBg: 'rgba(46,160,67,0.08)',
      darkBorder: 'rgba(46,160,67,0.2)',
    },
    {
      icon: FiTarget,
      label: 'Success Rate',
      value: `${Number(safe.pass_rate || 0).toFixed(1)}%`,
      change: 'Score >= 60%',
      color: '#a371f7',
      darkBg: 'rgba(163,113,247,0.08)',
      darkBorder: 'rgba(163,113,247,0.2)',
    },
    {
      icon: FiClock,
      label: 'Study Hours',
      value: `${Number(safe.total_time_hours || 0).toFixed(1)}h`,
      change: 'Total time spent',
      color: '#f0883e',
      darkBg: 'rgba(240,136,62,0.08)',
      darkBorder: 'rgba(240,136,62,0.2)',
    },
  ]

  const card = (stat, index) => {
    const Icon = stat.icon
    return (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        style={darkMode ? {
          padding: '16px', borderRadius: '12px',
          backgroundColor: stat.darkBg,
          border: `1px solid ${stat.darkBorder}`,
          transition: 'all 0.2s',
        } : {}}
        className={darkMode ? '' : `relative p-4 rounded-2xl border transition-all duration-300 bg-emerald-50 border-emerald-200 hover:shadow-lg hover:scale-[1.02]`}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={darkMode
              ? { backgroundColor: stat.darkBg, border: `1px solid ${stat.darkBorder}` }
              : { background: `linear-gradient(135deg, ${stat.color}, ${stat.color})` }
            }
          >
            <Icon style={{ width: 22, height: 22, color: darkMode ? stat.color : 'white' }} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#4b5563' }}>{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '11px', color: darkMode ? '#8b949e' : '#6b7280' }}>
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>Quick Stats</h3>
        <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280', marginTop: '4px' }}>Your performance overview</p>
      </div>

      <div className="space-y-4">
        {cards.map((stat, index) => card(stat, index))}
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={darkMode ? {
          marginTop: '20px', padding: '16px', borderRadius: '12px',
          backgroundColor: 'rgba(46,160,67,0.06)',
          border: '1px solid rgba(46,160,67,0.2)',
        } : {}}
        className={darkMode ? '' : 'mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100'}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={darkMode
              ? { backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)' }
              : { background: 'linear-gradient(135deg, #059669, #0d9488)' }
            }
          >
            <span style={{ fontSize: '18px' }}>🎯</span>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>Keep it up!</h4>
            <p style={{ fontSize: '12px', color: darkMode ? '#8b949e' : '#4b5563', marginTop: '4px' }}>
              Your stats update based on your own submissions—stay consistent to improve.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuickStats
