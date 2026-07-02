import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, FileText, GraduationCap } from 'lucide-react'
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

const ACCENT = '#f0883e'   // orange accent for CBSE

const CLASSES = [
  { key: 'class-10', label: 'Class 10', num: '10th', sub: 'Board Exam Year' },
  { key: 'class-12', label: 'Class 12', num: '12th', sub: 'Board Exam Year' },
]

export default function CBSEHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* Navbar — same as SyllabusHome */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <AliceLogo size={32} />
            <span className="alice-brand-text" style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="cbse-hero" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(240,136,62,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(240,136,62,0.1)`, border: `1px solid rgba(240,136,62,0.3)`, color: ACCENT, fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 20 }}>
            <GraduationCap size={14} /> CBSE Syllabus & Resources
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
            Welcome to{' '}
            <span style={{ color: ACCENT, textShadow: `0 0 30px rgba(240,136,62,0.4)` }}>CBSE</span>
            <br />
            <span style={{ color: '#8b949e', fontSize: '0.55em', fontWeight: 400, letterSpacing: 0 }}>Syllabus, Notes & Study Resources</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            Explore complete CBSE syllabus, chapter-wise topics, notes and resources for Class 9–12.
          </p>
        </div>

        {/* Class Selection Card */}
        <div className="cbse-class-card" style={{
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
            CBSE Resources
          </p>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 700, textAlign: 'center', marginBottom: 32, color: '#e6edf3' }}>
            Please select your Class!
          </h2>

          <div className="cbse-class-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            {CLASSES.map((c) => (
              <Link
                key={c.key}
                to={`/cbse/${c.key}`}
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
                  e.currentTarget.style.boxShadow = `0 0 16px rgba(240,136,62,0.2)`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#30363d'
                  e.currentTarget.style.color = '#e6edf3'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: ACCENT }}>{c.num}</span>
                <span>{c.label}</span>
                <span style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 400 }}>{c.sub}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info strip and Banners removed */}

      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .cbse-class-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .cbse-class-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cbse-syllabus-banner { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .cbse-pyq-banner { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .cbse-banner-right { align-self: center !important; }
          .cbse-info-strip { flex-direction: column; gap: 14px !important; align-items: flex-start !important; padding-left: 20px; }
          .cbse-class-card { padding: 20px 16px !important; }
          .cbse-hero { padding: 40px 16px !important; }
          .cbse-hero h1 { font-size: 2.2rem !important; }
          .cbse-hero p { font-size: 0.9rem !important; }
        }
      `}</style>
      
      <PremiumFooter />
    </div>
  )
}
