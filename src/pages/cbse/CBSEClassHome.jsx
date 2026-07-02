import { useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, FileText, ChevronRight, ArrowLeft } from 'lucide-react'
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

const ACCENT = '#f0883e'

const CLASS_LABELS = {
  'class-10': { label: 'Class 10', num: '10th' },
  'class-12': { label: 'Class 12', num: '12th' },
}

const OPTIONS = [
  {
    key: 'syllabus',
    icon: BookOpen,
    color: '#3fb950',
    title: 'Syllabus',
    desc: 'Chapter-wise syllabus, topics & study resources for all subjects',
    badge: 'Updated 2024–25',
  },
  {
    key: 'pyq',
    icon: FileText,
    color: '#79c0ff',
    title: 'PYQ Papers',
    desc: 'Previous year CBSE board question papers — year-wise & subject-wise',
    badge: 'Free Download',
  },
]

export default function CBSEClassHome() {
  const { classKey } = useParams()
  const cls = CLASS_LABELS[classKey]

  if (!cls) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2>Class not found</h2>
        <Link to="/cbse" style={{ color: ACCENT }}>← Back to CBSE</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* Navbar */}
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 20px 60px' }}>

        {/* Glow */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(240,136,62,0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Back */}
        <div style={{ width: '100%', maxWidth: 600, marginBottom: 28 }}>
          <Link
            to="/cbse"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8b949e', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = ACCENT}
            onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}
          >
            <ArrowLeft size={15} /> Back to CBSE
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44, position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(240,136,62,0.1)`, border: `1px solid rgba(240,136,62,0.3)`, color: ACCENT, fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 16 }}>
            CBSE — {cls.label}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.2, marginBottom: 10 }}>
            What are you looking for?
          </h1>
          <p style={{ color: '#8b949e', fontSize: '0.95rem', maxWidth: 380, margin: '0 auto' }}>
            Choose an option below to access {cls.label} resources.
          </p>
        </div>

        {/* Option Cards */}
        <div className="cbse-option-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 600 }}>
          {OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <Link
                key={opt.key}
                to={`/cbse/${classKey}/${opt.key}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  padding: '28px 24px',
                  background: 'rgba(22,27,34,0.85)',
                  border: '1px solid #30363d',
                  borderRadius: 14,
                  textDecoration: 'none',
                  color: '#e6edf3',
                  transition: 'all 0.22s ease',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = opt.color
                  e.currentTarget.style.boxShadow = `0 0 24px ${opt.color}22`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.background = 'rgba(22,27,34,0.98)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#30363d'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'rgba(22,27,34,0.85)'
                }}
              >
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${opt.color}18`, border: `1px solid ${opt.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={opt.color} />
                </div>

                {/* Text */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e6edf3', marginBottom: 6 }}>{opt.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#8b949e', lineHeight: 1.5 }}>{opt.desc}</div>
                </div>

                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.7rem', color: opt.color, fontWeight: 600, background: `${opt.color}15`, padding: '3px 10px', borderRadius: 20 }}>{opt.badge}</span>
                  <ChevronRight size={16} color={opt.color} />
                </div>
              </Link>
            )
          })}
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .cbse-option-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cbse-class-hero { padding: 40px 16px !important; }
          .cbse-class-hero h1 { font-size: 2.2rem !important; }
          .cbse-class-hero p { font-size: 0.9rem !important; }
          .cbse-class-nav-links { display: none !important; } /* Simplify navbar on very small screens if needed, or flex-wrap */
        }
      `}</style>
      
      <PremiumFooter />
    </div>
  )
}
