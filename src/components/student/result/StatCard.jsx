import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const StatCard = ({ icon: Icon, label, value, color = 'blue', delay = 0 }) => {
  const [count, setCount] = useState(0)

  // Subtle count-up animation
  useEffect(() => {
    const duration = 800
    const steps = 30
    const increment = value / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(increment * currentStep))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-900 dark:text-blue-100'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-900 dark:text-green-100'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-900 dark:text-red-100'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-800/50',
      border: 'border-gray-200 dark:border-gray-700',
      icon: 'text-gray-600 dark:text-gray-400',
      text: 'text-gray-900 dark:text-gray-100'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-5 rounded-xl ${colors.bg} border ${colors.border} backdrop-blur-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
        className={`text-3xl font-bold ${colors.text} mb-1`}
      >
        {count}
      </motion.div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </p>
    </motion.div>
  )
}

export default StatCard
