import { motion } from 'framer-motion'
import { FiAlertTriangle, FiEye, FiUser, FiMonitor } from 'react-icons/fi'

const RecentViolations = () => {
  const violations = [
    {
      id: 1,
      type: 'Face Not Detected',
      exam: 'Mathematics Final',
      timestamp: '2026-02-19 10:23 AM',
      severity: 'high',
      icon: FiUser,
      description: 'Face was not visible for 15 seconds'
    },
    {
      id: 2,
      type: 'Multiple Faces',
      exam: 'Physics Quiz',
      timestamp: '2026-02-18 2:45 PM',
      severity: 'critical',
      icon: FiEye,
      description: 'Additional person detected in frame'
    },
    {
      id: 3,
      type: 'Tab Switch',
      exam: 'Computer Science',
      timestamp: '2026-02-17 11:30 AM',
      severity: 'medium',
      icon: FiMonitor,
      description: 'Browser tab switched during exam'
    },
    {
      id: 4,
      type: 'Looking Away',
      exam: 'English Literature',
      timestamp: '2026-02-16 9:15 AM',
      severity: 'low',
      icon: FiEye,
      description: 'Eyes not focused on screen for 8 seconds'
    }
  ]

  const getSeverityStyles = (severity) => {
    const styles = {
      critical: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700 border-red-200',
        icon: 'text-red-600'
      },
      high: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700 border-orange-200',
        icon: 'text-orange-600'
      },
      medium: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: 'text-yellow-600'
      },
      low: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: 'text-blue-600'
      }
    }
    return styles[severity]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Violations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-detected behavioral alerts</p>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      {violations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-green-900 mb-2">No Violations</h4>
          <p className="text-sm text-green-700">Great job! Keep up the good work.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {violations.map((violation, index) => {
            const Icon = violation.icon
            const styles = getSeverityStyles(violation.severity)
            
            return (
              <motion.div
                key={violation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-2xl border transition-all duration-300
                  hover:shadow-lg ${styles.bg} ${styles.border}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${styles.bg} ${styles.border} border
                  `}>
                    <Icon className={`w-6 h-6 ${styles.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={`font-semibold ${styles.text}`}>
                        {violation.type}
                      </h4>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0
                        ${styles.badge}
                      `}>
                        {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {violation.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{violation.exam}</span>
                      <span>•</span>
                      <span>{violation.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline connector */}
                {index < violations.length - 1 && (
                  <div className="absolute left-9 top-16 w-0.5 h-3 bg-gray-200" />
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Total Violations</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last 30 days</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{violations.length}</div>
        </div>
      </motion.div>
    </div>
  )
}

export default RecentViolations
