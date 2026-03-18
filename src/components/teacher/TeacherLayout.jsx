import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherNavbar from './TeacherNavbar';
import { useTheme } from '../../contexts/ThemeContext';

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

  return (
    <div
      style={darkMode
        ? { minHeight: '100vh', backgroundColor: '#0d1117', position: 'relative' }
        : { minHeight: '100vh', backgroundColor: '#f9fafb' }
      }
    >
      <StarField active={darkMode} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <TeacherSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div style={{ marginLeft: sidebarCollapsed ? 80 : 280, transition: 'margin 0.3s' }}>
          <TeacherNavbar
            title={getTitle()}
            sidebarCollapsed={sidebarCollapsed}
          />

          <main style={{ paddingTop: 64, padding: '80px 24px 24px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
