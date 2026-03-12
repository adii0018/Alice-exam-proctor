import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiMoon, FiSun, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

const DashboardNavbar = ({ title = 'Dashboard', sidebarCollapsed }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const notificationRef = useRef(null)
  const profileRef = useRef(null)

  const notifications = [
    { id: 1, type: 'warning', message: 'Face detection lost during Math Exam', time: '5m ago' },
    { id: 2, type: 'info', message: 'New exam available: Physics Quiz', time: '1h ago' },
    { id: 3, type: 'success', message: 'Exam completed successfully', time: '2h ago' },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleProfileClick = () => {
    setShowProfileMenu(false)
    navigate('/student/profile')
  }

  const handleSettingsClick = () => {
    setShowProfileMenu(false)
    navigate('/student/settings')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}
      className="fixed top-0 right-0 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-30 transition-all duration-300"
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-2 h-2 rounded-full mt-2 flex-shrink-0
                            ${notif.type === 'warning' ? 'bg-yellow-500' : ''}
                            ${notif.type === 'info' ? 'bg-blue-500' : ''}
                            ${notif.type === 'success' ? 'bg-green-500' : ''}
                          `} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                >
                  <div className="p-2">
                    <button 
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">View Profile</span>
                    </button>
                    <button 
                      onClick={handleSettingsClick}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <FiSettings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">Settings</span>
                    </button>
                    <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <FiLogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default DashboardNavbar
