import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, MonitorPlay,
  BarChart3, AlertTriangle, Settings, UserCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../common/UserAvatar';

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
      <rect width="100" height="100" rx="22" fill="url(#lgTeacher)"/>
      <defs>
        <linearGradient id="lgTeacher" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
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

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher' },
  { icon: FileText, label: 'Exams', path: '/teacher/exams' },
  { icon: Users, label: 'Students', path: '/teacher/students' },
  { icon: MonitorPlay, label: 'Live Monitoring', path: '/teacher/live' },
  { icon: BarChart3, label: 'Results', path: '/teacher/results' },
  { icon: AlertTriangle, label: 'Violations', path: '/teacher/violations' },
  { icon: UserCircle, label: 'Profile', path: '/teacher/profile' },
  { icon: Settings, label: 'Settings', path: '/teacher/settings' },
];

export default function TeacherSidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const { user } = useAuth();

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
    chevronColor: darkMode ? '#8b949e' : '#57606a',
    footerText: darkMode ? '#6e7681' : '#57606a',
    bottomBg: darkMode ? '#161b22' : '#f6f8fa',
    bottomBorder: darkMode ? '#30363d' : '#d0d7de',
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
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
      {/* Logo */}
      <div
        style={{
          height: 64, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px',
          borderBottom: `1px solid ${gh.border}`,
        }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <AliceLogo size={38} dark={darkMode} />
              <span style={{ fontWeight: 600, fontSize: '15px', color: gh.text }}>Alice Proctor</span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ margin: '0 auto' }}
            >
              <AliceLogo size={38} dark={darkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              padding: '6px', borderRadius: '8px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer', color: gh.chevronColor,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ChevronLeft style={{ width: 18, height: 18 }} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              padding: '4px', borderRadius: '6px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer', color: gh.chevronColor,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => navigate(item.path)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? gh.activeBg : 'transparent',
                  color: isActive ? gh.activeText : gh.text,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all 0.15s',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = gh.hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="teacherActiveBar"
                    style={{
                      position: 'absolute', left: 0,
                      width: 3, height: 28,
                      backgroundColor: gh.activeBar,
                      borderRadius: '0 4px 4px 0',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon style={{ width: 18, height: 18, flexShrink: 0, color: isActive ? gh.activeText : gh.iconColor }} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer - User Profile */}
      <div style={{ padding: 16, borderTop: `1px solid ${gh.border}` }}>
        <Link to="/teacher/profile" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: gh.bottomBg,
              border: `1px solid ${gh.bottomBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserAvatar
              user={user}
              size={32}
              showBorder={true}
              borderColor={gh.bottomBorder}
              fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #2da44e, #2c974b)'}
            />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p style={{ fontSize: '13px', fontWeight: 600, color: gh.text, margin: 0 }}>
                    {user?.name || user?.username || 'Teacher'}
                  </p>
                  <p style={{ fontSize: '11px', color: gh.subText, margin: 0 }}>View Profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
