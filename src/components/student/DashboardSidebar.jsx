import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiHome, 
  FiFileText, 
  FiLogIn, 
  FiAlertTriangle, 
  FiUser, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation()
  
  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/student', badge: null },
    { icon: FiFileText, label: 'My Exams', path: '/student/exams', badge: null },
    { icon: FiLogIn, label: 'Join Exam', path: '/student/join', badge: 'Live' },
    { icon: FiAlertTriangle, label: 'Violations', path: '/student/violations', badge: null },
    { icon: FiUser, label: 'Profile', path: '/student/profile', badge: null },
    { icon: FiSettings, label: 'Settings', path: '/student/settings', badge: null },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-40 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Alice
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Exam Proctor</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`font-medium ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && !isCollapsed && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30
          ${isCollapsed ? 'flex justify-center' : ''}
        `}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            S
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">Student</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export default DashboardSidebar
