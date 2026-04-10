import { motion } from 'framer-motion'
import { FiHome, FiFileText, FiLogIn, FiAlertTriangle, FiUser } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const MobileBottomNav = () => {
  const location = useLocation()
  
  const navItems = [
    { icon: FiHome, label: 'Home', path: '/student' },
    { icon: FiFileText, label: 'Exams', path: '/student/exams' },
    { icon: FiLogIn, label: 'Join', path: '/student/join' },
    { icon: FiAlertTriangle, label: 'Alerts', path: '/student/violations' },
    { icon: FiUser, label: 'Profile', path: '/student/profile' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50 md:hidden"
    >
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`
                  p-2 rounded-xl transition-colors
                  ${active ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}
                `}
              >
                <Icon className={`w-6 h-6 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </motion.div>
              <span className={`text-xs font-medium ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {item.label}
              </span>
              
              {active && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute -top-1 w-1 h-1 bg-emerald-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}

export default MobileBottomNav
