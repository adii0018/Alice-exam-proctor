import { motion } from 'framer-motion'
import { FiAlertTriangle, FiEye, FiUser, FiMonitor, FiFilter } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/student/DashboardLayout'

const iconMap = {
  NO_FACE: FiUser,
  MULTIPLE_FACES: FiEye,
  TAB_SWITCH: FiMonitor,
  FULLSCREEN_EXIT: FiMonitor,
  LOOKING_AWAY: FiEye,
  SUSPICIOUS_BEHAVIOR: FiAlertTriangle,
}

const Violations = () => {
  const [filter, setFilter] = useState('all')
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/violations/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch violations')
        const data = await res.json()
        setViolations(data.violations || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchViolations()
  }, [])

  const getSeverityStyles = (severity) => ({
    critical: { 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      border: 'border-red-200 dark:border-red-800', 
      text: 'text-red-700 dark:text-red-400', 
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700', 
      icon: 'text-red-600 dark:text-red-400' 
    },
    high: { 
      bg: 'bg-orange-50 dark:bg-orange-900/20', 
      border: 'border-orange-200 dark:border-orange-800', 
      text: 'text-orange-700 dark:text-orange-400', 
      badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700', 
      icon: 'text-orange-600 dark:text-orange-400' 
    },
    medium: { 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      border: 'border-yellow-200 dark:border-yellow-800', 
      text: 'text-yellow-700 dark:text-yellow-400', 
      badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700', 
      icon: 'text-yellow-600 dark:text-yellow-400' 
    },
    low: { 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      border: 'border-blue-200 dark:border-blue-800', 
      text: 'text-blue-700 dark:text-blue-400', 
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700', 
      icon: 'text-blue-600 dark:text-blue-400' 
    },
  }[severity] || { 
    bg: 'bg-gray-50 dark:bg-gray-800', 
    border: 'border-gray-200 dark:border-gray-700', 
    text: 'text-gray-700 dark:text-gray-300', 
    badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600', 
    icon: 'text-gray-600 dark:text-gray-400' 
  })

  const filtered = filter === 'all' ? violations : violations.filter(v => v.severity === filter)

  const counts = ['critical', 'high', 'medium', 'low'].reduce((acc, s) => {
    acc[s] = violations.filter(v => v.severity === s).length
    return acc
  }, {})

  return (
    <DashboardLayout title="Violations">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical', key: 'critical', bgClass: 'bg-red-50 dark:bg-red-900/30', borderClass: 'border-red-200 dark:border-red-800', textClass: 'text-red-700 dark:text-red-400', valueClass: 'text-red-600 dark:text-red-400' },
            { label: 'High', key: 'high', bgClass: 'bg-orange-50 dark:bg-orange-900/30', borderClass: 'border-orange-200 dark:border-orange-800', textClass: 'text-orange-700 dark:text-orange-400', valueClass: 'text-orange-600 dark:text-orange-400' },
            { label: 'Medium', key: 'medium', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', borderClass: 'border-yellow-200 dark:border-yellow-800', textClass: 'text-yellow-700 dark:text-yellow-400', valueClass: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'Low', key: 'low', bgClass: 'bg-blue-50 dark:bg-blue-900/30', borderClass: 'border-blue-200 dark:border-blue-800', textClass: 'text-blue-700 dark:text-blue-400', valueClass: 'text-blue-600 dark:text-blue-400' },
          ].map(({ label, key, bgClass, borderClass, textClass, valueClass }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl border ${bgClass} ${borderClass}`}>
              <p className={`text-sm mb-1 ${textClass}`}>{label}</p>
              <p className={`text-3xl font-bold ${valueClass}`}>{counts[key]}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Violations</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
          </div>
        )}
        {error && <p className="text-center text-red-500 py-6">{error}</p>}

        {/* Violations List */}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map((v, index) => {
              const Icon = iconMap[v.violation_type] || FiAlertTriangle
              const styles = getSeverityStyles(v.severity)
              const timestamp = v.timestamp ? new Date(v.timestamp).toLocaleString() : 'N/A'
              return (
                <motion.div key={v._id || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${styles.bg} ${styles.border}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.bg} ${styles.border} border`}>
                      <Icon className={`w-6 h-6 ${styles.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`font-semibold ${styles.text}`}>{v.violation_type?.replace(/_/g, ' ')}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${styles.badge}`}>
                          {v.severity?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>{timestamp}</span>
                        {v.metadata?.duration && <><span>•</span><span>Duration: {v.metadata.duration}s</span></>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <FiAlertTriangle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No violations found</h3>
                <p className="text-gray-600 dark:text-gray-400">Great job! Keep up the good work.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Violations
