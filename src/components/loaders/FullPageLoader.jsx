import { useEffect, useRef, useState } from 'react'

// ── Star field (same as landing/auth) ────────────────────────────────────────
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

// ── Leaf logo SVG ─────────────────────────────────────────────────────────────
function LeafLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Loader ────────────────────────────────────────────────────────────────────
export default function FullPageLoader() {
  const [progress, setProgress] = useState(0)
  const [dot, setDot] = useState(0)

  // progress bar
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); return 100 }
        // accelerate early, slow near end
        const step = p < 70 ? 8 : p < 90 ? 3 : 1
        return Math.min(100, p + step)
      })
    }, 180)
    return () => clearInterval(id)
  }, [])

  // animated dots
  useEffect(() => {
    const id = setInterval(() => setDot(d => (d + 1) % 4), 400)
    return () => clearInterval(id)
  }, [])

  const dots = '.'.repeat(dot)

  const STATUS_STEPS = [
    { at: 0,  label: 'Initializing runtime' },
    { at: 25, label: 'Loading AI models' },
    { at: 50, label: 'Connecting to server' },
    { at: 75, label: 'Preparing dashboard' },
    { at: 95, label: 'Almost ready' },
  ]
  const currentStep = [...STATUS_STEPS].reverse().find(s => progress >= s.at)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0d1117',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes leaf-pulse {
          0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 8px rgba(46,160,67,0.4)); }
          50%       { transform: scale(1.07); filter: drop-shadow(0 0 18px rgba(63,185,80,0.7)); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-ring {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Stars */}
      <StarField />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, animation: 'fade-in 0.5s ease' }}>

        {/* Spinning ring + logo */}
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 28 }}>
          {/* outer spinning ring */}
          <svg
            width="96" height="96" viewBox="0 0 96 96"
            style={{ position: 'absolute', inset: 0, animation: 'spin-ring 2.4s linear infinite' }}
          >
            <circle cx="48" cy="48" r="44" fill="none" stroke="#21262d" strokeWidth="3"/>
            <circle
              cx="48" cy="48" r="44"
              fill="none"
              stroke="#2ea043"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44 * progress / 100} ${2 * Math.PI * 44}`}
              strokeDashoffset={2 * Math.PI * 44 * 0.25}
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          {/* leaf logo centered */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'leaf-pulse 2.5s ease-in-out infinite' }}>
            <LeafLogo size={56} />
          </div>
        </div>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ color: '#e6edf3', fontWeight: 800, fontSize: '1.3rem', letterSpacing: -0.3, marginBottom: 4 }}>
            Alice Proctor
          </div>
          <div style={{ color: '#8b949e', fontSize: '0.8rem' }}>
            AI-Powered Exam Proctoring
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: 280 }}>
          <div style={{ height: 4, background: '#21262d', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #238636, #3fb950)',
              borderRadius: 4,
              transition: 'width 0.3s ease',
              boxShadow: '0 0 8px rgba(63,185,80,0.5)',
            }} />
          </div>

          {/* Status line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8b949e', fontSize: '0.75rem', fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
              {currentStep?.label}{dots}
            </span>
            <span style={{ color: '#3fb950', fontSize: '0.75rem', fontWeight: 600, fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {STATUS_STEPS.map((s, i) => (
            <div key={i} style={{
              width: progress >= s.at ? 20 : 6,
              height: 4,
              borderRadius: 2,
              background: progress >= s.at ? '#2ea043' : '#21262d',
              transition: 'all 0.4s ease',
              boxShadow: progress >= s.at ? '0 0 6px rgba(46,160,67,0.4)' : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* Bottom credit */}
      <div style={{ position: 'absolute', bottom: 24, color: '#484f58', fontSize: '0.72rem', fontFamily: 'monospace', letterSpacing: 1 }}>
        A S R
      </div>
    </div>
  )
}
