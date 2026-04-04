import { motion } from 'framer-motion'
import { FiAlertTriangle, FiEye, FiUser, FiMonitor } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'

const RecentViolations = () => {
  const { darkMode } = useTheme()

  const violations = [
    { id: 1, type: 'Face Not Detected', exam: 'Mathematics Final', timestamp: '2026-02-19 10:23 AM', severity: 'high', icon: FiUser, description: 'Face was not visible for 15 seconds' },
    { id: 2, type: 'Multiple Faces', exam: 'Physics Quiz', timestamp: '2026-02-18 2:45 PM', severity: 'critical', icon: FiEye, description: 'Additional person detected in frame' },
    { id: 3, type: 'Tab Switch', exam: 'Computer Science', timestamp: '2026-02-17 11:30 AM', severity: 'medium', icon: FiMonitor, description: 'Browser tab switched during exam' },
    { id: 4, type: 'Looking Away', exam: 'English Literature', timestamp: '2026-02-16 9:15 AM', severity: 'low', icon: FiEye, description: 'Eyes not focused on screen for 8 seconds' },
  ]

  const darkSeverity = {
    critical: { bg: 'rgba(248,81,73,0.06)', border: 'rgba(248,81,73,0.25)', text: '#f85149', badge: { bg: 'rgba(248,81,73,0.1)', color: '#f85149', border: 'rgba(248,81,73,0.3)' } },
    high:     { bg: 'rgba(240,136,62,0.06)', border: 'rgba(240,136,62,0.25)', text: '#f0883e', badge: { bg: 'rgba(240,136,62,0.1)', color: '#f0883e', border: 'rgba(240,136,62,0.3)' } },
    medium:   { bg: 'rgba(210,153,34,0.06)', border: 'rgba(210,153,34,0.25)', text: '#d2a21a', badge: { bg: 'rgba(210,153,34,0.1)', color: '#d2a21a', border: 'rgba(210,153,34,0.3)' } },
    low:      { bg: 'rgba(56,139,253,0.06)', border: 'rgba(56,139,253,0.25)', text: '#388bfd', badge: { bg: 'rgba(56,139,253,0.1)', color: '#388bfd', border: 'rgba(56,139,253,0.3)' } },
  }

  const lightSeverity = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700 border-red-200', icon: 'text-red-600' },
    high:     { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'text-orange-600' },
    medium:   { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'text-yellow-600' },
    low:      { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'text-blue-600' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>Recent Violations</h3>
          <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280', marginTop: '4px' }}>AI-detected behavioral alerts</p>
        </div>
        <button style={{ fontSize: '13px', color: darkMode ? '#3fb950' : '#2da44e', fontWeight: 500 }}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {violations.map((violation, index) => {
          const Icon = violation.icon

          if (darkMode) {
            const s = darkSeverity[violation.severity]
            return (
              <motion.div
                key={violation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '16px', borderRadius: '12px',
                  backgroundColor: s.bg, border: `1px solid ${s.border}`,
                  transition: 'all 0.2s',
                }}
              >
                <div className="flex items-start gap-4">
                  <div style={{
                    width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
                    backgroundColor: s.bg, border: `1px solid ${s.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 20, height: 20, color: s.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 style={{ fontWeight: 600, color: s.text }}>{violation.type}</h4>
                      <span style={{
                        padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                        backgroundColor: s.badge.bg, color: s.badge.color, border: `1px solid ${s.badge.border}`,
                        flexShrink: 0,
                      }}>
                        {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8b949e', marginBottom: '6px' }}>{violation.description}</p>
                    <div className="flex items-center gap-3" style={{ fontSize: '12px', color: '#6e7681' }}>
                      <span style={{ fontWeight: 500 }}>{violation.exam}</span>
                      <span>•</span>
                      <span>{violation.timestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          }

          const ls = lightSeverity[violation.severity]
          return (
            <motion.div
              key={violation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${ls.bg} ${ls.border}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ls.bg} ${ls.border} border`}>
                  <Icon className={`w-6 h-6 ${ls.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={`font-semibold ${ls.text}`}>{violation.type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${ls.badge}`}>
                      {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{violation.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="font-medium">{violation.exam}</span>
                    <span>•</span>
                    <span>{violation.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={darkMode ? {
          marginTop: '16px', padding: '16px', borderRadius: '12px',
          backgroundColor: '#161b22', border: '1px solid #30363d',
        } : {}}
        className={darkMode ? '' : 'mt-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600'}
      >
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: darkMode ? '#e6edf3' : '#111827' }}>Total Violations</p>
            <p style={{ fontSize: '12px', color: darkMode ? '#8b949e' : '#6b7280', marginTop: '2px' }}>Last 30 days</p>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>{violations.length}</div>
        </div>
      </motion.div>
    </div>
  )
}

export default RecentViolations
