import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherNavbar from './TeacherNavbar';
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../common/UserAvatar';

// Alice logo — same as student dashboard
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
      <rect width="100" height="100" rx="22" fill="url(#lgTeacherLayout)"/>
      <defs>
        <linearGradient id="lgTeacherLayout" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#9333ea"/>
        </linearGradient>
      </defs>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.65"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
)

// StarField canvas — same as student dashboard
const StarField = ({ active }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
      initStars()
    }

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 6000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        bright: Math.random() < 0.06,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const alpha = 0.3 + 0.5 * Math.sin(s.phase + t * s.speed)
        const r = s.bright ? s.r * 1.06 : s.r
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}

export default function TeacherLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const getTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path === '/teacher') return 'Dashboard';
    if (path === '/teacher/exams') return 'Exams';
    if (path === '/teacher/students') return 'Students';
    if (path === '/teacher/live') return 'Live Monitoring';
    if (path === '/teacher/results') return 'Results';
    if (path === '/teacher/violations') return 'Violations';
    if (path === '/teacher/profile') return 'Profile';
    if (path === '/teacher/settings') return 'Settings';
    return 'Dashboard';
  };

  const gh = {
    mobileBg: darkMode ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.8)',
    mobileBorder: darkMode ? '#21262d' : 'rgba(229,231,235,0.5)',
    titleColor: darkMode ? '#e6edf3' : '#111827',
    subColor: darkMode ? '#8b949e' : '#6b7280',
    avatarBg: darkMode ? '#21262d' : undefined,
    avatarBorder: darkMode ? '#30363d' : undefined,
  };

  return (
    <div
      style={darkMode
        ? { minHeight: '100vh', backgroundColor: '#0d1117', position: 'relative' }
        : { minHeight: '100vh', backgroundColor: '#f9fafb' }
      }
    >
      <StarField active={darkMode} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <TeacherSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content */}
        <div 
          className="md:ml-[280px] transition-all duration-300"
          style={{
            marginLeft: window.innerWidth >= 768 ? (sidebarCollapsed ? '80px' : '280px') : '0'
          }}
        >
          {/* Desktop Navbar */}
          <div className="hidden md:block">
            <TeacherNavbar
              title={getTitle()}
              sidebarCollapsed={sidebarCollapsed}
            />
          </div>

          {/* Mobile Header */}
          <div
            className="md:hidden sticky top-0 z-30 backdrop-blur-xl px-4 py-4"
            style={{
              backgroundColor: gh.mobileBg,
              borderBottom: `1px solid ${gh.mobileBorder}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AliceLogo size={40} dark={darkMode} />
                <div>
                  <h1
                    className="text-lg font-bold"
                    style={darkMode 
                      ? { color: '#e6edf3' } 
                      : { background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                    }
                  >
                    {getTitle()}
                  </h1>
                  <p style={{ fontSize: '11px', color: gh.subColor }}>Teacher Dashboard</p>
                </div>
              </div>
              <UserAvatar
                user={user}
                size={40}
                showBorder={darkMode}
                borderColor={gh.avatarBorder}
                fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #3b82f6, #9333ea)'}
              />
            </div>
          </div>

          {/* Content Area */}
          <main className="pt-6 md:pt-24 px-4 md:px-8 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
