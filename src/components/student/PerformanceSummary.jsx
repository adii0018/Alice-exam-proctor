import { motion } from 'framer-motion'
import { FiTrendingUp, FiAward, FiTarget, FiClock } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const PerformanceSummary = ({ dashboardStats = null, activityScores = [] }) => {
  const { darkMode } = useTheme()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [animatedValues, setAnimatedValues] = useState({
    exams: 0,
    completion: 0,
    score: 0,
    time: 0
  })

  const safeStats = dashboardStats || {}
  const totalAttempts = Number(safeStats.total_attempts || 0)
  const completionRate = Number(safeStats.completion_rate || 0)
  const averageScore = Number(safeStats.average_score || 0)
  const totalTimeHours = Number(safeStats.total_time_hours || 0)
  const activityHeightsRaw = Array.isArray(activityScores) && activityScores.length ? activityScores : safeStats.activity_scores_last_7_days
  const activityHeights = Array.from({ length: 7 }, (_, i) => Number(activityHeightsRaw?.[i] || 0))

  const stats = [
    {
      icon: FiTarget,
      label: 'Exams Attempted',
      value: String(totalAttempts),
      animatedKey: 'exams',
      targetValue: totalAttempts,
      change: 'Based on your attempts',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/50',
      darkColor: '#388bfd',
      darkBg: 'rgba(56,139,253,0.08)',
      darkBorder: 'rgba(56,139,253,0.2)',
    },
    {
      icon: FiAward,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      animatedKey: 'completion',
      targetValue: completionRate,
      change: 'Based on available exams',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/50',
      darkColor: '#a371f7',
      darkBg: 'rgba(163,113,247,0.08)',
      darkBorder: 'rgba(163,113,247,0.2)',
    },
    {
      icon: FiTrendingUp,
      label: 'Average Score',
      value: `${averageScore}%`,
      animatedKey: 'score',
      targetValue: averageScore,
      change: 'From your submissions',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      shadowColor: 'shadow-green-500/50',
      darkColor: '#3fb950',
      darkBg: 'rgba(46,160,67,0.08)',
      darkBorder: 'rgba(46,160,67,0.2)',
    },
    {
      icon: FiClock,
      label: 'Total Time',
      value: `${totalTimeHours}h`,
      animatedKey: 'time',
      targetValue: totalTimeHours,
      change: 'Total time spent',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/50',
      darkColor: '#f0883e',
      darkBg: 'rgba(240,136,62,0.08)',
      darkBorder: 'rgba(240,136,62,0.2)',
    }
  ]

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    stats.forEach(stat => {
      let current = 0
      const increment = stat.targetValue / steps
      
      const timer = setInterval(() => {
        current += increment
        if (current >= stat.targetValue) {
          current = stat.targetValue
          clearInterval(timer)
        }
        setAnimatedValues(prev => ({
          ...prev,
          [stat.animatedKey]: Math.floor(current)
        }))
      }, interval)
    })
  }, [])

  return (
    <div className="perspective-1000">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>
            Performance Summary
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="inline-block">✨</motion.span>
          </h3>
          <p className="text-sm mt-1" style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>Your academic progress</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const displayValue = stat.animatedKey === 'exams'
            ? animatedValues[stat.animatedKey]
            : stat.animatedKey === 'time'
            ? `${animatedValues[stat.animatedKey]}h`
            : `${animatedValues[stat.animatedKey]}%`

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, z: 50, transition: { duration: 0.3 } }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <div
                style={darkMode ? {
                  position: 'relative', padding: '24px', borderRadius: '12px', overflow: 'hidden',
                  backgroundColor: hoveredCard === index ? '#1c2128' : '#161b22',
                  border: `1px solid ${hoveredCard === index ? stat.darkBorder : '#30363d'}`,
                  transition: 'all 0.3s',
                  transform: hoveredCard === index ? 'translateZ(20px)' : 'translateZ(0px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: hoveredCard === index ? `0 8px 32px ${stat.darkBg}` : 'none',
                } : {}}
                className={darkMode ? '' : `relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-500 ${hoveredCard === index ? `shadow-2xl ${stat.shadowColor}` : 'shadow-lg'}`}
              >
                {/* Background tint on hover */}
                {darkMode && hoveredCard === index && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: stat.darkBg,
                    pointerEvents: 'none',
                  }} />
                )}
                {!darkMode && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0`}
                    animate={{ opacity: hoveredCard === index ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  style={darkMode ? {
                    width: 48, height: 48, borderRadius: '10px', marginBottom: '16px',
                    backgroundColor: stat.darkBg, border: `1px solid ${stat.darkBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  } : {}}
                  className={darkMode ? '' : `w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 relative`}
                  animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                  transition={{ scale: { duration: 0.3 } }}
                >
                  <Icon style={{ width: 22, height: 22, color: darkMode ? stat.darkColor : 'white' }} className={darkMode ? '' : 'w-7 h-7 text-white relative z-10'} />
                </motion.div>

                {/* Value */}
                <div className="mb-2 relative">
                  <motion.p
                    style={darkMode ? { fontSize: '2rem', fontWeight: 700, color: '#e6edf3' } : {}}
                    className={darkMode ? '' : 'text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'}
                    animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayValue}
                  </motion.p>
                </div>

                {/* Label */}
                <p style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#8b949e' : '#374151', marginBottom: '8px' }}>
                  {stat.label}
                </p>

                {/* Change badge */}
                <div style={darkMode ? {
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                  backgroundColor: stat.change.includes('+') ? 'rgba(46,160,67,0.1)' : 'rgba(110,118,129,0.1)',
                  color: stat.change.includes('+') ? '#3fb950' : '#8b949e',
                  border: `1px solid ${stat.change.includes('+') ? 'rgba(46,160,67,0.3)' : 'rgba(110,118,129,0.3)'}`,
                } : {}}
                  className={darkMode ? '' : `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {stat.change.includes('+') && <span>📈</span>}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
        style={darkMode ? {
          marginTop: '32px', padding: '24px', borderRadius: '12px',
          backgroundColor: '#161b22', border: '1px solid #30363d',
          position: 'relative', overflow: 'hidden',
        } : {}}
        className={darkMode ? '' : 'mt-8 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden'}
      >
        {!darkMode && (
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>
              Recent Activity
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>📊</motion.span>
            </h4>
            <span
              style={darkMode ? {
                fontSize: '11px', color: '#8b949e', padding: '4px 12px',
                borderRadius: '9999px', backgroundColor: '#21262d', border: '1px solid #30363d',
              } : {}}
              className={darkMode ? '' : 'text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100'}
            >
              Last 7 days
            </span>
          </div>

          <div className="flex items-end justify-between h-40 gap-3 relative">
            {activityHeights.map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 relative group cursor-pointer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              >
                <div
                  className="h-full rounded-t-xl relative overflow-hidden"
                  style={darkMode ? {
                    background: `linear-gradient(to top, #2ea043, #3fb950)`,
                    opacity: 0.8,
                  } : {
                    background: 'linear-gradient(to top, #3b82f6, #a855f7, #ec4899)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    style={{
                      position: 'absolute', top: -44, left: '50%', transform: 'translateX(-50%)',
                      backgroundColor: darkMode ? '#21262d' : '#111827',
                      color: 'white', fontSize: '11px', padding: '4px 10px',
                      borderRadius: '6px', whiteSpace: 'nowrap',
                      border: darkMode ? '1px solid #30363d' : 'none',
                    }}
                  >
                    Score: {height}%
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {[25, 50, 75].map((pos) => (
              <motion.div
                key={pos}
                className="absolute left-0 right-0"
                style={{
                  bottom: `${pos}%`,
                  borderTop: `1px dashed ${darkMode ? '#30363d' : 'rgba(156,163,175,0.4)'}`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <motion.span
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.05 }}
                className="flex-1 text-center"
                style={{ fontSize: '11px', fontWeight: 500, color: darkMode ? '#8b949e' : '#6b7280' }}
              >
                {day}
              </motion.span>
            ))}
          </div>
        </div>

        {!darkMode && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
          </>
        )}
      </motion.div>
    </div>
  )
}

export default PerformanceSummary
