import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText,
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
          <stop offset="0%" stopColor="#059669"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
      </defs>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.65"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
)

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher' },
  { icon: FileText, label: 'Exams', path: '/teacher/exams' },
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
    bg: darkMode ? 'rgba(13,17,23,0.95)' : 'rgba(255,255,255,0.95)',
    border: darkMode ? '#21262d' : 'rgba(229,231,235,0.8)',
    text: darkMode ? '#e6edf3' : '#374151',
    subText: darkMode ? '#8b949e' : '#6b7280',
    hoverBg: darkMode ? '#21262d' : '#f9fafb',
    activeBg: darkMode ? 'rgba(46,160,67,0.1)' : 'rgba(5,150,105,0.06)',
    activeText: darkMode ? '#3fb950' : '#059669',
    activeBar: darkMode ? '#2ea043' : '#059669',
    iconColor: darkMode ? '#8b949e' : '#6b7280',
    chevronColor: darkMode ? '#8b949e' : '#6b7280',
    footerText: darkMode ? '#6e7681' : '#9ca3af',
    bottomBg: darkMode ? '#161b22' : '#f9fafb',
    bottomBorder: darkMode ? '#30363d' : '#e5e7eb',
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
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
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

      {/* Footer */}
      <div style={{ padding: 16, borderTop: `1px solid ${gh.border}` }}>
        <Link to="/teacher/profile">
          <div
            className={`p-3 rounded-xl ${collapsed ? 'flex justify-center' : 'flex items-center gap-3'} cursor-pointer transition-all`}
            style={darkMode
              ? { backgroundColor: '#161b22', border: `1px solid ${gh.bottomBorder}` }
              : { background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1px solid #a7f3d0' }
            }
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserAvatar
              user={user}
              size={32}
              showBorder={darkMode}
              borderColor={gh.bottomBorder}
              fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #059669, #0d9488)'}
            />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm font-medium" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>
                    {user?.name || user?.username || 'Teacher'}
                  </p>
                  <p style={{ fontSize: '11px', color: gh.subText }}>View Profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
