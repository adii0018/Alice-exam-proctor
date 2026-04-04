import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiFileText, FiLogIn, FiAlertTriangle, FiUser, FiSettings,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import UserAvatar from '../common/UserAvatar'
import { AVATAR_STYLES } from '../../utils/avatarGenerator'

// Alice logo — same as landing page
const AliceLogo = ({ size = 36, dark }) => (
  dark ? (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="url(#lgSide)"/>
      <defs>
        <linearGradient id="lgSide" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2da44e"/>
          <stop offset="100%" stopColor="#2c974b"/>
        </linearGradient>
      </defs>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.65"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#1f6f3a" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
)

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation()
  const { darkMode } = useTheme()
  const { user } = useAuth()

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/student', badge: null },
    { icon: FiFileText, label: 'My Exams', path: '/student/exams', badge: null },
    { icon: FiLogIn, label: 'Join Exam', path: '/student/join', badge: 'Live' },
    { icon: FiAlertTriangle, label: 'Violations', path: '/student/violations', badge: null },
    { icon: FiUser, label: 'Profile', path: '/student/profile', badge: null },
    { icon: FiSettings, label: 'Settings', path: '/student/settings', badge: null },
  ]

  const isActive = (path) => location.pathname === path

  // GitHub-inspired theme colors
  const gh = {
    bg: darkMode ? 'rgba(13,17,23,0.95)' : 'rgba(255,255,255,0.98)',
    border: darkMode ? '#21262d' : '#d0d7de',
    text: darkMode ? '#e6edf3' : '#1f2328',
    subText: darkMode ? '#8b949e' : '#57606a',
    hoverBg: darkMode ? '#21262d' : '#f6f8fa',
    activeBg: darkMode ? 'rgba(46,160,67,0.1)' : 'rgba(45,164,78,0.08)',
    activeText: darkMode ? '#3fb950' : '#2da44e',
    activeBar: darkMode ? '#2ea043' : '#2da44e',
    iconColor: darkMode ? '#8b949e' : '#57606a',
    bottomBg: darkMode ? '#161b22' : 'rgba(45,164,78,0.05)',
    bottomBorder: darkMode ? '#30363d' : '#d0d7de',
    avatarBg: darkMode ? '#21262d' : undefined,
    avatarBorder: darkMode ? '#30363d' : '#d0d7de',
    chevronColor: darkMode ? '#8b949e' : '#57606a',
    logoBg: darkMode ? '#161b22' : 'linear-gradient(135deg, #2da44e, #2c974b)',
    logoBorder: darkMode ? '#30363d' : 'none',
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed', left: 0, top: 0,
        height: '100vh',
        backgroundColor: gh.bg,
        borderRight: `1px solid ${gh.border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: darkMode ? 'none' : '0 0 0 1px rgba(31,35,40,0.04)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: darkMode ? undefined : '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      }}
    >
      {/* Logo Section */}
      <div
        className="h-20 flex items-center justify-between px-6"
        style={{ borderBottom: `1px solid ${gh.border}` }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: darkMode ? 'transparent' : 'linear-gradient(135deg, #2da44e, #2c974b)',
                  border: darkMode ? 'none' : 'none',
                }}
              >
                <AliceLogo size={40} dark={darkMode} />
              </div>
              <div>
                <h1
                  className="text-lg font-bold"
                  style={darkMode
                    ? { color: '#e6edf3' }
                    : { color: '#1f2328', fontWeight: 600 }
                  }
                >
                  Alice
                </h1>
                <p style={{ fontSize: '11px', color: gh.subText }}>Exam Proctor</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: gh.chevronColor }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isCollapsed
            ? <FiChevronRight className="w-5 h-5" />
            : <FiChevronLeft className="w-5 h-5" />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link key={item.path} to={item.path} className="block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: active ? gh.activeBg : 'transparent',
                  color: active ? gh.activeText : gh.text,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = gh.hoverBg }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 rounded-r-full"
                    style={{ backgroundColor: gh.activeBar }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: active ? gh.activeText : gh.iconColor }} />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && !isCollapsed && (
                  <span
                    className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full"
                    style={darkMode
                      ? { backgroundColor: 'rgba(46,160,67,0.15)', color: '#3fb950', border: '1px solid rgba(46,160,67,0.3)' }
                      : { backgroundColor: 'rgba(45,164,78,0.1)', color: '#2da44e', border: '1px solid rgba(45,164,78,0.2)' }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4" style={{ borderTop: `1px solid ${gh.border}` }}>
        <Link to="/student/profile">
          <div
            className={`p-3 rounded-xl ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'} cursor-pointer transition-all`}
            style={darkMode
              ? { backgroundColor: '#161b22', border: `1px solid ${gh.bottomBorder}` }
              : { backgroundColor: gh.bottomBg, border: `1px solid ${gh.bottomBorder}` }
            }
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserAvatar
              user={user}
              size={32}
              showBorder={true}
              borderColor={gh.avatarBorder}
              fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #2da44e, #2c974b)'}
            />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm font-medium" style={{ color: darkMode ? '#e6edf3' : '#1f2328' }}>
                    {user?.name || user?.username || 'Student'}
                  </p>
                  <p style={{ fontSize: '11px', color: gh.subText }}>View Profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </motion.aside>
  )
}

export default DashboardSidebar
