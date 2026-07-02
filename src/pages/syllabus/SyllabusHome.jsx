import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, FileText } from 'lucide-react'
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
  { key: 'first-year',  label: 'First Year',  num: '1st' },
  { key: 'second-year', label: 'Second Year', num: '2nd' },
  { key: 'third-year',  label: 'Third Year',  num: '3rd' },
  { key: 'fourth-year', label: 'Fourth Year', num: '4th' },
]

export default function SyllabusHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <AliceLogo size={32} />
            <span style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/pyq" style={{ color: '#79c0ff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>PYQ Papers</Link>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="syllabus-hero" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(63,185,80,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', color: '#3fb950', fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 20 }}>
            <BookOpen size={14} /> B.Tech Syllabus — RGPV
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
            Welcome to{' '}
            <span style={{ color: '#3fb950', textShadow: '0 0 30px rgba(63,185,80,0.4)' }}>B.Tech</span>
            <br />
            <span style={{ color: '#8b949e', fontSize: '0.55em', fontWeight: 400, letterSpacing: 0 }}>Syllabus & Study Resources</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            Explore complete syllabus, unit-wise topics for all B.Tech branches at RGPV.
          </p>
        </div>

        {/* Year Selection Card */}
        <div className="year-select-card" style={{
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
            B.Tech Syllabus
          </p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 700, textAlign: 'center', marginBottom: 32, color: '#e6edf3' }}>
            Please select your Year !
          </h2>

          <div className="syllabus-year-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {YEARS.map((y) => (
              <Link
                key={y.key}
                to={`/syllabus/${y.key}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 10px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: 8,
                  color: '#e6edf3',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3fb950'
                  e.currentTarget.style.color = '#3fb950'
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(63,185,80,0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#30363d'
                  e.currentTarget.style.color = '#e6edf3'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {y.label} <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>

        {/* PYQ Banner Card */}
        <Link
          to="/pyq"
          className="pyq-banner-card"
          style={{
            marginTop: 20,
            maxWidth: 700,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: 'linear-gradient(135deg, rgba(121,192,255,0.1) 0%, rgba(121,192,255,0.04) 100%)',
            border: '1px solid rgba(121,192,255,0.3)',
            borderRadius: 12,
            padding: '18px 24px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(121,192,255,0.15)'
            e.currentTarget.style.borderColor = 'rgba(121,192,255,0.6)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(121,192,255,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(121,192,255,0.1) 0%, rgba(121,192,255,0.04) 100%)'
            e.currentTarget.style.borderColor = 'rgba(121,192,255,0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(121,192,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="#79c0ff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#e6edf3', fontSize: '0.95rem' }}>Previous Year Question Papers</div>
              <div style={{ color: '#8b949e', fontSize: '0.78rem', marginTop: 2 }}>Download PYQ papers — year-wise & subject-wise</div>
            </div>
          </div>
          <div className="pyq-banner-right" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#79c0ff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
            Browse PYQs <ChevronRight size={16} />
          </div>
        </Link>

      </div>

      <PremiumFooter />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .syllabus-year-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .pyq-banner-card { flex-direction: column !important; gap: 12px !important; }
          .pyq-banner-right { align-self: flex-start !important; }
          .pyq-banner-sub { display: none !important; }
          .year-select-card { padding: 20px 16px !important; }
        }
        @media (max-width: 380px) {
          .syllabus-year-grid { grid-template-columns: 1fr !important; }
          .syllabus-hero { padding: 40px 16px !important; }
        }
        @media (max-width: 340px) {
          .syllabus-brand-full { display: none !important; }
        }
      `}</style>
    </div>
  )
}
