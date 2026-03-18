import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

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

function LeafLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif', position: 'relative' }}>
      <StarField />
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
      <header style={{ borderBottom: '1px solid #21262d', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LeafLogo size={30} />
          <span style={{ color: '#e6edf3', fontWeight: 700, fontSize: '0.95rem' }}>Alice Proctor</span>
        </Link>
        <Link to="/" style={{ color: '#8b949e', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e6edf3'}
          onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to home
        </Link>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Left — branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <LeafLogo size={44} />
                <div>
                  <div style={{ color: '#e6edf3', fontWeight: 800, fontSize: '1.3rem', letterSpacing: -0.3 }}>Alice</div>
                  <div style={{ color: '#8b949e', fontSize: '0.78rem' }}>Exam Proctor</div>
                </div>
              </div>
              <h1 style={{ color: '#e6edf3', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 14 }}>
                Secure online<br />
                <span style={{ color: '#3fb950' }}>examinations.</span>
              </h1>
              <p style={{ color: '#8b949e', fontSize: '0.95rem', lineHeight: 1.75 }}>
                AI-powered proctoring for fair and trustworthy online exams. Monitor students in real-time with confidence.
              </p>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(46,160,67,0.12)', border: '1px solid rgba(46,160,67,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fb950', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Trust badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(46,160,67,0.08)', border: '1px solid rgba(46,160,67,0.2)', borderRadius: 20, padding: '6px 14px', width: 'fit-content' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950', display: 'inline-block', boxShadow: '0 0 6px #3fb950' }} />
              <span style={{ color: '#3fb950', fontSize: '0.78rem', fontWeight: 600 }}>Trusted by 10,000+ institutions</span>
            </div>
          </div>

          {/* Right — form card */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: '32px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, padding: 4, marginBottom: 28, gap: 4 }}>
              {['Sign in', 'Create account'].map((label, i) => {
                const active = i === 0 ? isLogin : !isLogin
                return (
                  <button
                    key={label}
                    onClick={() => setIsLogin(i === 0)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.15s ease',
                      background: active ? '#21262d' : 'transparent',
                      color: active ? '#e6edf3' : '#8b949e',
                      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p style={{ color: '#8b949e', fontSize: '0.82rem' }}>
                {isLogin ? 'Sign in to continue to Alice Exam Proctor' : 'Start conducting secure AI-proctored exams'}
              </p>
            </div>

            {isLogin ? <LoginForm onToggle={() => setIsLogin(false)} /> : <RegisterForm onToggle={() => setIsLogin(true)} />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #21262d', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Alice Exam Proctor &nbsp;·&nbsp;
          <a href="#" style={{ color: '#8b949e', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='#e6edf3'} onMouseLeave={e => e.currentTarget.style.color='#8b949e'}>Privacy</a>
          &nbsp;·&nbsp;
          <a href="#" style={{ color: '#8b949e', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color='#e6edf3'} onMouseLeave={e => e.currentTarget.style.color='#8b949e'}>Terms</a>
        </p>
      </footer>
      </div>{/* end z-index wrapper */}
    </div>
  )
}

export default AuthPage
