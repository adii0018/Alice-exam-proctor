import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ChevronRight, BookOpen } from 'lucide-react'
import AliceLogo from '../../components/common/AliceLogo'
import PremiumFooter from '../../components/common/PremiumFooter'

function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth, H = window.innerHeight
    const COUNT = Math.floor((W * H) / 6000)
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2, base: Math.random() * 0.5 + 0.15,
    }))
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; draw() }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${s.base})`; ctx.fill()
      }
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
}

const YEARS = [
  { key: 'first-year',  label: 'First Year',  num: '1st', sems: 'Sem 1 & 2' },
  { key: 'second-year', label: 'Second Year', num: '2nd', sems: 'Sem 3 & 4' },
  { key: 'third-year',  label: 'Third Year',  num: '3rd', sems: 'Sem 5 & 6' },
  { key: 'fourth-year', label: 'Fourth Year', num: '4th', sems: 'Sem 7 & 8' },
]

const ACCENT = '#79c0ff'  // blue accent for PYQ (distinct from syllabus green)

export default function PYQHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <AliceLogo size={32} />
            <span className="alice-brand-text" style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/syllabus" style={{ color: '#3fb950', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Syllabus</Link>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(121,192,255,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(121,192,255,0.1)', border: '1px solid rgba(121,192,255,0.3)', color: ACCENT, fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 20 }}>
            <FileText size={14} /> Previous Year Papers — RGPV
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
            Previous Year{' '}
            <span style={{ color: ACCENT, textShadow: `0 0 30px rgba(121,192,255,0.4)` }}>Question Papers</span>
            <br />
            <span style={{ color: '#8b949e', fontSize: '0.55em', fontWeight: 400, letterSpacing: 0 }}>B.Tech CSE — RGPV University</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            Download previous year end semester papers for all subjects. Select your year to get started.
          </p>
        </div>

        {/* Year Selection Card */}
        <div style={{
          background: 'rgba(22,27,34,0.85)',
          border: '1px solid #30363d',
          borderRadius: 16,
          padding: 'clamp(24px, 5vw, 48px)',
          backdropFilter: 'blur(20px)',
          maxWidth: 700,
          width: '100%',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <p style={{ color: '#8b949e', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, textAlign: 'center' }}>
            Select Your Year
          </p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 700, textAlign: 'center', marginBottom: 32, color: '#e6edf3' }}>
            Which year are you in?
          </h2>

          <div className="pyq-year-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {YEARS.map((y) => (
              <Link
                key={y.key}
                to={`/pyq/${y.key}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '18px 10px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: 8,
                  color: '#e6edf3',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ACCENT
                  e.currentTarget.style.color = ACCENT
                  e.currentTarget.style.boxShadow = `0 0 16px rgba(121,192,255,0.2)`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#30363d'
                  e.currentTarget.style.color = '#e6edf3'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: ACCENT }}>{y.num}</span>
                <span>{y.label}</span>
                <span style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 400 }}>{y.sems}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info strip */}
        <div className="pyq-info-strip" style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '📄', text: 'Official RGPV Papers' },
            { icon: '📥', text: 'Free PDF Download' },
            { icon: '📅', text: 'Year-wise Sorted' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b949e', fontSize: '0.85rem' }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Syllabus Banner Card */}
        <Link
          to="/syllabus"
          className="syllabus-banner-card"
          style={{
            marginTop: 20,
            maxWidth: 700,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: 'linear-gradient(135deg, rgba(63,185,80,0.1) 0%, rgba(63,185,80,0.04) 100%)',
            border: '1px solid rgba(63,185,80,0.3)',
            borderRadius: 12,
            padding: '18px 24px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(63,185,80,0.15)'
            e.currentTarget.style.borderColor = 'rgba(63,185,80,0.6)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(63,185,80,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(63,185,80,0.1) 0%, rgba(63,185,80,0.04) 100%)'
            e.currentTarget.style.borderColor = 'rgba(63,185,80,0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(63,185,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={20} color="#3fb950" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#e6edf3', fontSize: '0.95rem' }}>B.Tech Syllabus</div>
              <div style={{ color: '#8b949e', fontSize: '0.78rem', marginTop: 2 }}>Browse unit-wise syllabus for all subjects — RGPV</div>
            </div>
          </div>
          <div className="syllabus-banner-right" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3fb950', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
            View Syllabus <ChevronRight size={16} />
          </div>
        </Link>

      </div>

      <PremiumFooter />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .pyq-year-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .syllabus-banner-card { flex-direction: column !important; gap: 12px !important; }
          .syllabus-banner-right { align-self: flex-start !important; }
          .pyq-info-strip { gap: 14px !important; }
        }
        @media (max-width: 380px) {
          .pyq-year-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 320px) {
          .pyq-year-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
