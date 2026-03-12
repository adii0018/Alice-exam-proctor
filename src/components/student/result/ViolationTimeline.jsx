import { motion } from 'framer-motion'
import { FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'

const ViolationTimeline = ({ violations }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return {
          icon: FiAlertTriangle,
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
          iconColor: 'text-red-600 dark:text-red-400',
          dotColor: 'bg-red-500'
        }
      case 'medium':
        return {
          icon: FiAlertCircle,
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700',
          iconColor: 'text-orange-600 dark:text-orange-400',
          dotColor: 'bg-orange-500'
        }
      case 'low':
        return {
          icon: FiInfo,
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          dotColor: 'bg-yellow-500'
        }
      default:
        return {
          icon: FiInfo,
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700',
          iconColor: 'text-gray-600 dark:text-gray-400',
          dotColor: 'bg-gray-500'
        }
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Violation Timeline
      </h3>

      <div className="space-y-4">
        {violations.map((violation, index) => {
          const config = getSeverityConfig(violation.severity)
          const Icon = config.icon

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative"
            >
              {/* Timeline line */}
              {index < violations.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
              )}

              <div className={`relative flex items-start gap-4 p-4 rounded-xl ${config.bg} border ${config.border}`}>
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border ${config.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${config.dotColor} border-2 border-white dark:border-gray-900`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {violation.type}
                    </h4>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge} whitespace-nowrap`}>
                      {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{violation.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {violations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No violations detected during this exam
          </p>
        </div>
      )}
    </div>
  )
}

export default ViolationTimeline
