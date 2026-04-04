import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { useTheme } from '../contexts/ThemeContext'
import LightweightBackground from '../components/common/LightweightBackground'

function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = window.innerWidth
    let H = window.innerHeight

    const COUNT = Math.floor((W * H) / 5000)
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      base: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }))
    const BRIGHT = Math.floor(COUNT * 0.06)
    for (let i = 0; i < BRIGHT; i++) {
      stars[i].r = Math.random() * 1.6 + 1.0
      stars[i].base = Math.random() * 0.4 + 0.4
    }

    let t = 0
    function resize() {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++
      for (const s of stars) {
        const alpha = Math.max(0, Math.min(1, s.base + Math.sin(t * s.speed + s.phase) * 0.18))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize, { passive: true })
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
}

function LeafLogo({ size = 32, dark }) {
  return dark ? (
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
      <rect width="100" height="100" rx="22" fill="url(#lgAuth)"/>
      <defs>
        <linearGradient id="lgAuth" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
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
}

const FEATURES = [
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    text: 'Bank-level security & encryption',
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    text: 'Advanced AI behavior monitoring',
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    text: 'Real-time analytics & reports',
  },
]

const TRUST_LABELS = [
  'Trusted by 10,000+ institutions',
  'Used in 200+ universities',
  'GDPR compliant & secure',
  'Free for educators',
]

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [trustIndex, setTrustIndex] = useState(0)
  const [trustFade, setTrustFade] = useState(true)
  const { darkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      setTrustFade(false)
      setTimeout(() => {
        setTrustIndex(i => (i + 1) % TRUST_LABELS.length)
        setTrustFade(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const theme = {
    bg: darkMode ? '#0d1117' : '#f6f8fa',
    border: darkMode ? '#21262d' : '#d0d7de',
    text: darkMode ? '#e6edf3' : '#1f2328',
    subText: darkMode ? '#8b949e' : '#57606a',
    cardBg: darkMode ? '#161b22' : '#ffffff',
    cardBorder: darkMode ? '#30363d' : '#d0d7de',
    accent: darkMode ? '#3fb950' : '#2da44e',
    accentBg: darkMode ? 'rgba(46,160,67,0.12)' : 'rgba(45,164,78,0.08)',
    accentBorder: darkMode ? 'rgba(46,160,67,0.2)' : 'rgba(45,164,78,0.2)',
    tabBg: darkMode ? '#0d1117' : '#f6f8fa',
    tabActive: darkMode ? '#21262d' : '#ffffff',
    iconColor: darkMode ? '#8b949e' : '#57606a',
    hoverBg: darkMode ? '#21262d' : '#f6f8fa',
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg, 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif', 
      position: 'relative' 
    }}>
      {darkMode ? <StarField /> : <LightweightBackground />}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d1117; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
      `}</style>

      {/* Top bar */}
      <header style={{ 
        borderBottom: `1px solid ${theme.border}`, 
        padding: '0 24px', 
        height: 56, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexShrink: 0,
        boxShadow: darkMode ? 'none' : '0 1px 3px rgba(31,35,40,0.04)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LeafLogo size={30} dark={darkMode} />
          <span style={{ color: theme.text, fontWeight: 700, fontSize: '0.95rem' }}>Alice Proctor</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              padding: 8,
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <Link 
            to="/" 
            style={{ 
              color: theme.subText, 
              fontSize: '0.82rem', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              transition: 'color 0.15s' 
            }}
            onMouseEnter={e => e.currentTarget.style.color = theme.text}
            onMouseLeave={e => e.currentTarget.style.color = theme.subText}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Left — branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <LeafLogo size={44} dark={darkMode} />
                <div>
                  <div style={{ color: theme.text, fontWeight: 800, fontSize: '1.3rem', letterSpacing: -0.3 }}>Alice</div>
                  <div style={{ color: theme.subText, fontSize: '0.78rem' }}>Exam Proctor</div>
                </div>
              </div>
              <h1 style={{ color: theme.text, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 14 }}>
                Secure online<br />
                <span style={{ color: theme.accent }}>examinations.</span>
              </h1>
              <p style={{ color: theme.subText, fontSize: '0.95rem', lineHeight: 1.75 }}>
                AI-powered proctoring for fair and trustworthy online exams. Monitor students in real-time with confidence.
              </p>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    background: theme.accentBg, 
                    border: `1px solid ${theme.accentBorder}`, 
                    borderRadius: 8, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: theme.accent, 
                    flexShrink: 0 
                  }}>
                    {f.icon}
                  </div>
                  <span style={{ color: theme.subText, fontSize: '0.875rem' }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Trust badge — dynamic */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              background: theme.accentBg, 
              border: `1px solid ${theme.accentBorder}`, 
              borderRadius: 20, 
              padding: '6px 14px', 
              width: 'fit-content', 
              minWidth: 260 
            }}>
              <span style={{ 
                width: 7, 
                height: 7, 
                borderRadius: '50%', 
                background: theme.accent, 
                display: 'inline-block', 
                flexShrink: 0, 
                boxShadow: `0 0 6px ${theme.accent}`, 
                animation: 'auth-pulse 2s infinite' 
              }} />
              <span style={{
                color: theme.accent, 
                fontSize: '0.78rem', 
                fontWeight: 600,
                opacity: trustFade ? 1 : 0,
                transform: trustFade ? 'translateY(0)' : 'translateY(-5px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                display: 'inline-block',
              }}>
                {TRUST_LABELS[trustIndex]}
              </span>
            </div>
            <style>{`
              @keyframes auth-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(63,185,80,0.5); }
                50% { box-shadow: 0 0 0 4px rgba(63,185,80,0); }
              }
            `}</style>
          </div>

          {/* Right — form card */}
          <div style={{ 
            background: theme.cardBg, 
            border: `1px solid ${theme.cardBorder}`, 
            borderRadius: 12, 
            padding: '32px 28px', 
            boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 24px rgba(31,35,40,0.12)' 
          }}>
            {/* Tab switcher */}
            <div style={{ 
              display: 'flex', 
              background: theme.tabBg, 
              border: `1px solid ${theme.cardBorder}`, 
              borderRadius: 8, 
              padding: 4, 
              marginBottom: 28, 
              gap: 4 
            }}>
              {['Sign in', 'Create account'].map((label, i) => {
                const active = i === 0 ? isLogin : !isLogin
                return (
                  <button
                    key={label}
                    onClick={() => setIsLogin(i === 0)}
                    style={{
                      flex: 1, 
                      padding: '8px 0', 
                      borderRadius: 6, 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      transition: 'all 0.15s ease',
                      background: active ? theme.tabActive : 'transparent',
                      color: active ? theme.text : theme.subText,
                      boxShadow: active ? (darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(31,35,40,0.08)') : 'none',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ color: theme.text, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p style={{ color: theme.subText, fontSize: '0.82rem' }}>
                {isLogin ? 'Sign in to continue to Alice Exam Proctor' : 'Start conducting secure AI-proctored exams'}
              </p>
            </div>

            {isLogin ? <LoginForm onToggle={() => setIsLogin(false)} /> : <RegisterForm onToggle={() => setIsLogin(true)} />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: theme.subText, fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Alice Exam Proctor &nbsp;·&nbsp;
          <a href="#" style={{ color: theme.subText, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color=theme.text} onMouseLeave={e => e.currentTarget.style.color=theme.subText}>Privacy</a>
          &nbsp;·&nbsp;
          <a href="#" style={{ color: theme.subText, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color=theme.text} onMouseLeave={e => e.currentTarget.style.color=theme.subText}>Terms</a>
        </p>
      </footer>
      </div>{/* end z-index wrapper */}
    </div>
  )
}

export default AuthPage
