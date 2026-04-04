import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiMoon, FiSun, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import UserAvatar from '../common/UserAvatar'
import { AVATAR_STYLES } from '../../utils/avatarGenerator'

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

  const handleLogout = () => { logout(); navigate('/') }
  const handleProfileClick = () => { setShowProfileMenu(false); navigate('/student/profile') }
  const handleSettingsClick = () => { setShowProfileMenu(false); navigate('/student/settings') }

  // GitHub-inspired theme colors
  const gh = {
    navBg: darkMode ? 'rgba(13,17,23,0.9)' : 'rgba(255,255,255,0.95)',
    navBorder: darkMode ? '#21262d' : '#d0d7de',
    titleColor: darkMode ? '#e6edf3' : '#1f2328',
    subColor: darkMode ? '#8b949e' : '#57606a',
    iconColor: darkMode ? '#8b949e' : '#57606a',
    hoverBg: darkMode ? '#21262d' : '#f6f8fa',
    dropdownBg: darkMode ? '#161b22' : '#ffffff',
    dropdownBorder: darkMode ? '#30363d' : '#d0d7de',
    itemHover: darkMode ? '#21262d' : '#f6f8fa',
    itemText: darkMode ? '#e6edf3' : '#1f2328',
    divider: darkMode ? '#21262d' : '#d0d7de',
    avatarBg: darkMode ? '#21262d' : undefined,
    avatarBorder: darkMode ? '#30363d' : '#d0d7de',
    avatarColor: darkMode ? '#3fb950' : '#2da44e',
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        backgroundColor: gh.navBg,
        borderBottom: `1px solid ${gh.navBorder}`,
        position: 'fixed', top: 0, right: 0,
        height: '80px',
        zIndex: 30,
        backdropFilter: 'blur(16px)',
        boxShadow: darkMode ? 'none' : '0 1px 3px rgba(31,35,40,0.04)',
        transition: 'all 0.3s',
        fontFamily: darkMode ? undefined : '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold" style={{ color: gh.titleColor }}>{title}</h2>
          <p className="text-sm" style={{ color: gh.subColor }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: gh.iconColor }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: gh.dropdownBg, border: `1px solid ${gh.dropdownBorder}` }}
                >
                  <div className="p-4" style={{ borderBottom: `1px solid ${gh.divider}` }}>
                    <h3 className="font-semibold" style={{ color: gh.itemText }}>Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 transition-colors cursor-pointer"
                        style={{ borderBottom: `1px solid ${gh.divider}` }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.itemHover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notif.type === 'warning' ? 'bg-yellow-500' :
                            notif.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm" style={{ color: gh.itemText }}>{notif.message}</p>
                            <p className="text-xs mt-1" style={{ color: gh.subColor }}>{notif.time}</p>
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
            className="p-2 rounded-xl transition-colors"
            style={{ color: gh.iconColor }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <UserAvatar
                user={user}
                size={40}
                showBorder={true}
                borderColor={gh.avatarBorder}
                fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #2da44e, #2c974b)'}
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium" style={{ color: gh.titleColor }}>{user?.name || 'Student'}</p>
                <p className="text-xs" style={{ color: gh.subColor }}>Student</p>
              </div>
              <FiChevronDown className="w-4 h-4" style={{ color: gh.iconColor }} />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: gh.dropdownBg, border: `1px solid ${gh.dropdownBorder}` }}
                >
                  <div className="p-2">
                    {[
                      { icon: FiUser, label: 'View Profile', action: handleProfileClick },
                      { icon: FiSettings, label: 'Settings', action: handleSettingsClick },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                        style={{ color: gh.itemText }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.itemHover}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Icon className="w-4 h-4" style={{ color: gh.iconColor }} />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                    <div style={{ margin: '8px 0', borderTop: `1px solid ${gh.divider}` }} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(248,81,73,0.1)' : '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FiLogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">Logout</span>
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
