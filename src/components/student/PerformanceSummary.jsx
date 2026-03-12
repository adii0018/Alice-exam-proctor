import { motion } from 'framer-motion'
import { FiTrendingUp, FiAward, FiTarget, FiClock } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const PerformanceSummary = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [animatedValues, setAnimatedValues] = useState({
    exams: 0,
    completion: 0,
    score: 0,
    time: 0
  })

  const stats = [
    {
      icon: FiTarget,
      label: 'Exams Attempted',
      value: '12',
      animatedKey: 'exams',
      targetValue: 12,
      change: '+3 this month',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      icon: FiAward,
      label: 'Completion Rate',
      value: '94%',
      animatedKey: 'completion',
      targetValue: 94,
      change: '+5% from last month',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/50'
    },
    {
      icon: FiTrendingUp,
      label: 'Average Score',
      value: '87%',
      animatedKey: 'score',
      targetValue: 87,
      change: '+2% improvement',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      shadowColor: 'shadow-green-500/50'
    },
    {
      icon: FiClock,
      label: 'Total Time',
      value: '24h',
      animatedKey: 'time',
      targetValue: 24,
      change: 'Last 30 days',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/50'
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Performance Summary
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              ✨
            </motion.span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your academic progress</p>
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
              transition={{ 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                z: 50,
                transition: { duration: 0.3 }
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* 3D Card Container */}
              <div className={`
                relative p-6 rounded-2xl overflow-hidden
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                border border-gray-200 dark:border-gray-700
                transition-all duration-500
                ${hoveredCard === index ? `shadow-2xl ${stat.shadowColor}` : 'shadow-lg'}
              `}
              style={{
                transform: hoveredCard === index ? 'translateZ(20px)' : 'translateZ(0px)',
                transformStyle: 'preserve-3d'
              }}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0`}
                  animate={{
                    opacity: hoveredCard === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating Particles */}
                {hoveredCard === index && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${stat.gradient}`}
                        initial={{ 
                          x: Math.random() * 100 + '%',
                          y: '100%',
                          opacity: 0 
                        }}
                        animate={{ 
                          y: '-100%',
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Icon with 3D effect */}
                <motion.div 
                  className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} 
                    flex items-center justify-center mb-4 relative
                  `}
                  animate={{
                    rotateY: hoveredCard === index ? [0, 360] : 0,
                    scale: hoveredCard === index ? 1.1 : 1,
                  }}
                  transition={{ 
                    rotateY: { duration: 0.6 },
                    scale: { duration: 0.3 }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: hoveredCard === index 
                      ? '0 10px 30px rgba(0,0,0,0.3)' 
                      : '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <Icon className="w-7 h-7 text-white relative z-10" />
                  
                  {/* Icon glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient} blur-md`}
                    animate={{
                      opacity: hoveredCard === index ? 0.6 : 0,
                      scale: hoveredCard === index ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Animated Value */}
                <div className="mb-2 relative">
                  <motion.p 
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                    animate={{
                      scale: hoveredCard === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayValue}
                  </motion.p>
                  
                  {/* Shimmer effect on hover */}
                  {hoveredCard === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {stat.label}
                </p>

                {/* Change with animated badge */}
                <motion.div
                  className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${stat.change.includes('+') 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                  `}
                  animate={{
                    y: hoveredCard === index ? [-2, 0, -2] : 0,
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: hoveredCard === index ? Infinity : 0,
                  }}
                >
                  {stat.change.includes('+') && (
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📈
                    </motion.span>
                  )}
                  {stat.change}
                </motion.div>

                {/* 3D Border Effect */}
                <div 
                  className={`
                    absolute inset-0 rounded-2xl border-2 border-transparent
                    ${hoveredCard === index ? `bg-gradient-to-br ${stat.gradient}` : ''}
                  `}
                  style={{
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: '2px',
                    opacity: hoveredCard === index ? 0.5 : 0,
                    transition: 'opacity 0.3s'
                  }}
                />
              </div>

              {/* 3D Shadow Layer */}
              <div 
                className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient}
                  blur-xl opacity-0 -z-10
                  ${hoveredCard === index ? 'opacity-30' : ''}
                  transition-opacity duration-500
                `}
                style={{
                  transform: 'translateZ(-20px) scale(0.95)',
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* 3D Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Recent Activity
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.span>
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              Last 7 days
            </span>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-3 relative">
            {[65, 78, 82, 75, 88, 92, 87].map((height, index) => (
              <motion.div
                key={index}
                className="flex-1 relative group cursor-pointer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ 
                  delay: 0.8 + index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* 3D Bar */}
                <div 
                  className="h-full rounded-t-xl bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden shadow-lg"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(10px)',
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  
                  {/* Tooltip on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl"
                  >
                    Score: {height}%
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700" />
                  </motion.div>
                </div>

                {/* 3D Base shadow */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-sm"
                  style={{
                    transform: 'translateZ(-5px)',
                  }}
                />
              </motion.div>
            ))}

            {/* Animated grid lines */}
            {[25, 50, 75].map((position) => (
              <motion.div
                key={position}
                className="absolute left-0 right-0 border-t border-dashed border-gray-300 dark:border-gray-600 opacity-30"
                style={{ bottom: `${position}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <motion.span
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="flex-1 text-center"
              >
                {day}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
      </motion.div>
    </div>
  )
}

export default PerformanceSummary
