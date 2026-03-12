import { motion } from 'framer-motion';
import { TrendingUp, Award, CheckCircle, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PerformanceChart() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    score: 0,
    pass: 0,
    completion: 0
  });

  const metrics = [
    { 
      label: 'Average Score', 
      value: '78.5%', 
      targetValue: 78.5,
      animatedKey: 'score',
      icon: TrendingUp, 
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/50',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
      trend: '+5.2%'
    },
    { 
      label: 'Pass Rate', 
      value: '85.2%', 
      targetValue: 85.2,
      animatedKey: 'pass',
      icon: CheckCircle, 
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/50',
      bgClass: 'bg-green-50',
      textClass: 'text-green-600',
      trend: '+3.8%'
    },
    { 
      label: 'Completion Rate', 
      value: '92.8%', 
      targetValue: 92.8,
      animatedKey: 'completion',
      icon: Award, 
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/50',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600',
      trend: '+7.1%'
    },
  ];

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    metrics.forEach(metric => {
      let current = 0;
      const increment = metric.targetValue / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= metric.targetValue) {
          current = metric.targetValue;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({
          ...prev,
          [metric.animatedKey]: current.toFixed(1)
        }));
      }, interval);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg perspective-1000">
      {/* Header with animated icon */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Performance Insights
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </motion.span>
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
          Live Data
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const displayValue = `${animatedValues[metric.animatedKey]}%`;

          return (
            <motion.div
              key={metric.label}
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
              <div 
                className={`
                  relative p-6 rounded-2xl overflow-hidden
                  bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                  border border-gray-200 dark:border-gray-700
                  transition-all duration-500
                  ${hoveredCard === index ? `shadow-2xl ${metric.shadowColor}` : 'shadow-lg'}
                `}
                style={{
                  transform: hoveredCard === index ? 'translateZ(20px)' : 'translateZ(0px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0`}
                  animate={{
                    opacity: hoveredCard === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating Particles */}
                {hoveredCard === index && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${metric.gradient}`}
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

                {/* 3D Icon Container */}
                <motion.div 
                  className={`
                    w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.gradient}
                    flex items-center justify-center mx-auto mb-4 relative
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
                      ? '0 15px 40px rgba(0,0,0,0.3)' 
                      : '0 5px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <Icon className="w-8 h-8 text-white relative z-10" />
                  
                  {/* Icon glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient} blur-lg`}
                    animate={{
                      opacity: hoveredCard === index ? 0.7 : 0,
                      scale: hoveredCard === index ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Animated Value */}
                <div className="text-center mb-2 relative">
                  <motion.p 
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
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
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">
                  {metric.label}
                </p>

                {/* Trend Badge */}
                <motion.div
                  className="flex items-center justify-center gap-1"
                  animate={{
                    y: hoveredCard === index ? [-2, 0, -2] : 0,
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: hoveredCard === index ? Infinity : 0,
                  }}
                >
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <motion.span
                      animate={{ y: [-1, 1, -1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ↑
                    </motion.span>
                    {metric.trend}
                  </span>
                </motion.div>

                {/* 3D Border Effect */}
                <div 
                  className={`
                    absolute inset-0 rounded-2xl border-2 border-transparent
                    ${hoveredCard === index ? `bg-gradient-to-br ${metric.gradient}` : ''}
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
                  absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient}
                  blur-xl opacity-0 -z-10
                  ${hoveredCard === index ? 'opacity-30' : ''}
                  transition-opacity duration-500
                `}
                style={{
                  transform: 'translateZ(-20px) scale(0.95)',
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 3D Progress Bars Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          Detailed Breakdown
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📈
          </motion.span>
        </h4>
        
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {animatedValues[metric.animatedKey]}%
                </span>
              </div>
              
              {/* 3D Progress Bar */}
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedValues[metric.animatedKey]}%` }}
                  transition={{ 
                    delay: 1 + index * 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }}
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-tr-full pointer-events-none" />
    </div>
  );
}
