import { motion } from 'framer-motion'
import { FiAlertTriangle, FiEye, FiUser, FiMonitor, FiFilter } from 'react-icons/fi'
import { useState } from 'react'
import DashboardLayout from '../../components/student/DashboardLayout'

const Violations = () => {
  const [filter, setFilter] = useState('all') // all, critical, high, medium, low

  const violations = [
    {
      id: 1,
      type: 'Face Not Detected',
      exam: 'Mathematics Final',
      timestamp: '2026-02-19 10:23 AM',
      severity: 'high',
      icon: FiUser,
      description: 'Face was not visible for 15 seconds',
      duration: '15s'
    },
    {
      id: 2,
      type: 'Multiple Faces',
      exam: 'Physics Quiz',
      timestamp: '2026-02-18 2:45 PM',
      severity: 'critical',
      icon: FiEye,
      description: 'Additional person detected in frame',
      duration: '8s'
    },
    {
      id: 3,
      type: 'Tab Switch',
      exam: 'Computer Science',
      timestamp: '2026-02-17 11:30 AM',
      severity: 'medium',
      icon: FiMonitor,
      description: 'Browser tab switched during exam',
      duration: '3s'
    },
    {
      id: 4,
      type: 'Looking Away',
      exam: 'English Literature',
      timestamp: '2026-02-16 9:15 AM',
      severity: 'low',
      icon: FiEye,
      description: 'Eyes not focused on screen for 8 seconds',
      duration: '8s'
    },
    {
      id: 5,
      type: 'Audio Detected',
      exam: 'Chemistry Test',
      timestamp: '2026-02-15 3:20 PM',
      severity: 'medium',
      icon: FiMonitor,
      description: 'Unusual audio activity detected',
      duration: '5s'
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

  const filteredViolations = filter === 'all'
    ? violations
    : violations.filter(v => v.severity === filter)

  const severityCounts = {
    critical: violations.filter(v => v.severity === 'critical').length,
    high: violations.filter(v => v.severity === 'high').length,
    medium: violations.filter(v => v.severity === 'medium').length,
    low: violations.filter(v => v.severity === 'low').length
  }

  return (
    <DashboardLayout title="Violations">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-200"
          >
            <p className="text-sm text-red-700 mb-1">Critical</p>
            <p className="text-3xl font-bold text-red-600">{severityCounts.critical}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-orange-50 border border-orange-200"
          >
            <p className="text-sm text-orange-700 mb-1">High</p>
            <p className="text-3xl font-bold text-orange-600">{severityCounts.high}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200"
          >
            <p className="text-sm text-yellow-700 mb-1">Medium</p>
            <p className="text-3xl font-bold text-yellow-600">{severityCounts.medium}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-blue-50 border border-blue-200"
          >
            <p className="text-sm text-blue-700 mb-1">Low</p>
            <p className="text-3xl font-bold text-blue-600">{severityCounts.low}</p>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Violations</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>
        </div>

        {/* Violations List */}
        <div className="space-y-3">
          {filteredViolations.map((violation, index) => {
            const Icon = violation.icon
            const styles = getSeverityStyles(violation.severity)
            
            return (
              <motion.div
                key={violation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-6 rounded-2xl border transition-all duration-300
                  hover:shadow-lg ${styles.bg} ${styles.border}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${styles.bg} ${styles.border} border
                  `}>
                    <Icon className={`w-6 h-6 ${styles.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className={`font-semibold ${styles.text}`}>
                        {violation.type}
                      </h4>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0
                        ${styles.badge}
                      `}>
                        {violation.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {violation.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{violation.exam}</span>
                      <span>•</span>
                      <span>{violation.timestamp}</span>
                      <span>•</span>
                      <span>Duration: {violation.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredViolations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No violations found</h3>
            <p className="text-gray-600 dark:text-gray-400">Great job! Keep up the good work.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Violations
