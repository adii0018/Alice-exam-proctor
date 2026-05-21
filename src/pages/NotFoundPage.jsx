import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Leaf, Home, ArrowLeft, Search } from 'lucide-react'

// ── Star field background ────────────────────────────────────────────────────
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
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ── Floating particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(63,185,80,0.3)',
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [glitchActive, setGlitchActive] = useState(false)

  // Glitch effect interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Parallax mouse tracking
  useEffect(() => {
    const handler = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0d1117',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      overflow: 'hidden',
      color: '#e6edf3',
    }}>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(20px); opacity: 0.5; }
        }
        @keyframes airplane-fly {
          0% { transform: translate(-100vw, 20vh) rotate(-15deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100vw, -30vh) rotate(-15deg); opacity: 0; }
        }
        @keyframes leaf-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 95% 0); transform: translateX(0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translateX(-5px); }
          40% { clip-path: inset(40% 0 30% 0); transform: translateX(5px); }
          60% { clip-path: inset(60% 0 10% 0); transform: translateX(-3px); }
          80% { clip-path: inset(80% 0 0% 0); transform: translateX(3px); }
        }
        @keyframes glitch-2 {
          0%, 100% { clip-path: inset(95% 0 0 0); transform: translateX(0); }
          20% { clip-path: inset(60% 0 20% 0); transform: translateX(5px); }
          40% { clip-path: inset(30% 0 40% 0); transform: translateX(-5px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translateX(3px); }
          80% { clip-path: inset(0% 0 80% 0); transform: translateX(-3px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes orbit-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan-line {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(46,160,67,0.3); }
          50% { box-shadow: 0 0 30px rgba(63,185,80,0.5); }
        }

        .notfound-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
        }
        .notfound-btn-primary {
          background: linear-gradient(135deg, #238636, #2ea043);
          color: #fff;
          animation: btn-glow 2s ease-in-out infinite;
        }
        .notfound-btn-primary:hover {
          background: linear-gradient(135deg, #2ea043, #3fb950);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(46,160,67,0.4);
        }
        .notfound-btn-outline {
          background: rgba(22,27,34,0.8);
          color: #e6edf3;
          border: 1px solid #30363d;
        }
        .notfound-btn-outline:hover {
          background: #21262d;
          border-color: #8b949e;
          transform: translateY(-2px);
        }

        .notfound-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8b949e;
          text-decoration: none;
          font-size: 0.85rem;
          padding: 8px 14px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .notfound-link:hover {
          color: #3fb950;
          background: rgba(46,160,67,0.08);
        }
      `}</style>

      {/* Starfield */}
      <StarField />
      <FloatingParticles />

      {/* Scanning line effect */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(63,185,80,0.3), transparent)',
          animation: 'scan-line 4s linear infinite',
          zIndex: 1,
        }} />
      </div>

      {/* Flying airplane across screen */}
      <div style={{
        position: 'absolute', zIndex: 2, pointerEvents: 'none',
        animation: 'airplane-fly 8s linear infinite',
      }}>
        <Plane size={28} style={{ color: '#3fb950', filter: 'drop-shadow(0 0 12px rgba(63,185,80,0.6))' }} />
      </div>

      {/* Falling leaves */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${15 + i * 14}%`,
          zIndex: 2,
          pointerEvents: 'none',
          animation: `leaf-fall ${8 + i * 2}s linear ${i * 1.5}s infinite`,
        }}>
          <Leaf size={14 + i * 2} style={{
            color: 'rgba(63,185,80,0.3)',
            filter: 'drop-shadow(0 0 4px rgba(63,185,80,0.2))',
          }} />
        </div>
      ))}

      {/* Main Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        animation: 'fade-in-up 0.8s ease',
        transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        transition: 'transform 0.1s ease',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(46,160,67,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* 404 Icon — orbiting airplane + leaf center */}
        <div style={{
          position: 'relative',
          width: 140, height: 140,
          marginBottom: 36,
        }}>
          {/* Pulse rings */}
          <div style={{
            position: 'absolute', inset: -20,
            border: '1px solid rgba(46,160,67,0.15)',
            borderRadius: '50%',
            animation: 'pulse-ring 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: -40,
            border: '1px solid rgba(46,160,67,0.08)',
            borderRadius: '50%',
            animation: 'pulse-ring 3s ease-in-out 1s infinite',
          }} />

          {/* Outer dashed ring */}
          <div style={{
            position: 'absolute', inset: 0,
            border: '2px dashed rgba(139,148,158,0.2)',
            borderRadius: '50%',
            animation: 'orbit-spin 12s linear infinite',
          }} />

          {/* Orbiting airplane */}
          <div style={{
            position: 'absolute', inset: '8px',
            animation: 'orbit-spin 2.5s linear infinite',
          }}>
            <div style={{
              position: 'absolute', top: -8, left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              color: '#3fb950',
              filter: 'drop-shadow(0 0 12px rgba(63,185,80,0.7))',
            }}>
              <Plane size={22} style={{ fill: 'rgba(63,185,80,0.3)' }} />
            </div>
          </div>

          {/* Second airplane (opposite side) */}
          <div style={{
            position: 'absolute', inset: '8px',
            animation: 'orbit-spin 2.5s linear infinite',
            transform: 'rotate(180deg)',
          }}>
            <div style={{
              position: 'absolute', top: -8, left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              color: '#2ea043',
              filter: 'drop-shadow(0 0 8px rgba(46,160,67,0.5))',
            }}>
              <Plane size={16} style={{ fill: 'rgba(46,160,67,0.2)' }} />
            </div>
          </div>

          {/* Center leaf */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 72, height: 72,
              background: 'rgba(22,27,34,0.9)',
              border: '2px solid #30363d',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(46,160,67,0.15)',
            }}>
              <Leaf size={34} strokeWidth={2} style={{
                color: '#3fb950',
                fill: 'rgba(63,185,80,0.15)',
                filter: 'drop-shadow(0 0 10px rgba(63,185,80,0.4))',
              }} />
            </div>
          </div>
        </div>

        {/* 404 Text with glitch effect */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <h1 style={{
            fontSize: 'clamp(5rem, 12vw, 8rem)',
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #e6edf3 0%, #8b949e 50%, #3fb950 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            404
          </h1>
          {/* Glitch layers */}
          {glitchActive && (
            <>
              <h1 style={{
                position: 'absolute', inset: 0,
                fontSize: 'clamp(5rem, 12vw, 8rem)',
                fontWeight: 900, letterSpacing: -4, lineHeight: 1,
                color: '#3fb950',
                animation: 'glitch-1 0.2s linear',
                opacity: 0.7,
              }}>404</h1>
              <h1 style={{
                position: 'absolute', inset: 0,
                fontSize: 'clamp(5rem, 12vw, 8rem)',
                fontWeight: 900, letterSpacing: -4, lineHeight: 1,
                color: '#f85149',
                animation: 'glitch-2 0.2s linear',
                opacity: 0.5,
              }}>404</h1>
            </>
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
          fontWeight: 700,
          color: '#e6edf3',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Page Not Found
        </h2>

        {/* Description */}
        <p style={{
          color: '#8b949e',
          fontSize: '0.95rem',
          textAlign: 'center',
          maxWidth: 440,
          lineHeight: 1.7,
          marginBottom: 8,
        }}>
          Looks like this page got lost in the exam hall. The AI proctor couldn't find it either.
        </p>

        {/* Error code badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(248,81,73,0.08)',
          border: '1px solid rgba(248,81,73,0.2)',
          color: '#f85149',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 14px',
          borderRadius: 20,
          marginBottom: 36,
          fontFamily: '"SFMono-Regular", Consolas, monospace',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f85149', animation: 'pulse-ring 2s infinite' }} />
          ERROR_PAGE_NOT_FOUND
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex', gap: 14,
          flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: 40,
        }}>
          <Link to="/" className="notfound-btn notfound-btn-primary">
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="notfound-btn notfound-btn-outline"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div style={{
          background: 'rgba(22,27,34,0.6)',
          border: '1px solid #21262d',
          borderRadius: 12,
          padding: '20px 28px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            color: '#484f58',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Quick Navigation
          </div>
          <div style={{
            display: 'flex', gap: 4,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <Link to="/" className="notfound-link">
              <Home size={14} /> Landing
            </Link>
            <Link to="/auth" className="notfound-link">
              <Search size={14} /> Sign In
            </Link>
            <Link to="/student" className="notfound-link">
              <Leaf size={14} /> Student
            </Link>
            <Link to="/teacher" className="notfound-link">
              <Plane size={14} /> Teacher
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom credit */}
      <div style={{
        position: 'absolute', bottom: 24,
        color: '#484f58', fontSize: '0.72rem',
        fontFamily: 'monospace', letterSpacing: 1,
        zIndex: 10,
      }}>
        Alice Exam Proctor • A S R
      </div>
    </div>
  )
}
