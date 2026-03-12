import { motion } from 'framer-motion'
import { FiTrendingUp, FiAward, FiClock, FiTarget } from 'react-icons/fi'

const QuickStats = () => {
  const stats = [
    {
      icon: FiAward,
      label: 'Total Exams',
      value: '12',
      change: '+3 this month',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: FiTrendingUp,
      label: 'Average Score',
      value: '87%',
      change: '+5% improvement',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: FiTarget,
      label: 'Success Rate',
      value: '92%',
      change: 'Excellent',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      icon: FiClock,
      label: 'Study Hours',
      value: '24h',
      change: 'This week',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Stats</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your performance overview</p>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              relative p-4 rounded-2xl border transition-all duration-300
              ${stat.bgColor} ${stat.borderColor}
              hover:shadow-lg hover:scale-[1.02]
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${stat.color}
              `}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Keep it up!</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              You're performing great this month. Stay consistent to achieve your goals!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuickStats
