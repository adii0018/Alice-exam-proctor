import { useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, ArrowLeft, BookOpen, FlaskConical, Globe, Languages, BookText, Monitor } from 'lucide-react'
import AliceLogo from '../../components/common/AliceLogo'

function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth, H = window.innerHeight
    const COUNT = Math.floor((W * H) / 6000)
    const stars = Array.from({ length: COUNT }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2, base: Math.random() * 0.5 + 0.15 }))
    function resize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; draw() }
    function draw() { ctx.clearRect(0, 0, W, H); for (const s of stars) { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,220,255,${s.base})`; ctx.fill() } }
    resize()
    window.addEventListener('resize', resize, { passive: true })
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
}

const ACCENT = '#79c0ff'
const SUBJECTS = [
  { key: 'math',    label: 'Mathematics',           icon: BookOpen,     color: '#f0883e' },
  { key: 'science', label: 'Science',               icon: FlaskConical, color: '#3fb950' },
  { key: 'sst',     label: 'Social Science',        icon: Globe,        color: '#79c0ff' },
  { key: 'hindi',   label: 'Hindi',                 icon: Languages,    color: '#d2a8ff' },
  { key: 'english', label: 'English',               icon: BookText,     color: '#ffa657' },
  { key: 'it',      label: 'Information Technology',icon: Monitor,      color: '#56d364' },
]
const CLASS_LABELS = { 'class-10': 'Class 10', 'class-12': 'Class 12' }

export default function CBSEPYQSubjects() {
  const { classKey } = useParams()
  const classLabel = CLASS_LABELS[classKey] || 'CBSE'

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <AliceLogo size={32} />
            <span className="alice-brand-text" style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to={`/cbse/${classKey}/syllabus`} style={{ color: '#3fb950', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Syllabus</Link>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      <div className="cbse-pyq-wrap" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px 60px' }}>
        <div style={{ width: '100%', maxWidth: 720, marginBottom: 28 }}>
          <Link to={`/cbse/${classKey}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8b949e', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}>
            <ArrowLeft size={15} /> Back to Options
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(121,192,255,0.1)', border: '1px solid rgba(121,192,255,0.3)', color: ACCENT, fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 16 }}>
            CBSE {classLabel} — PYQ Papers
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.2, marginBottom: 10 }}>
            Select a <span style={{ color: ACCENT }}>Subject</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '0.95rem', maxWidth: 420, margin: '0 auto' }}>
            Choose a subject to access year-wise CBSE board question papers.
          </p>
        </div>

        <div className="cbse-pyq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, width: '100%', maxWidth: 720 }}>
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon
            return (
              <Link key={sub.key} to={`/cbse/${classKey}/pyq/${sub.key}`}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(22,27,34,0.85)', border: '1px solid #30363d', borderRadius: 12, textDecoration: 'none', color: '#e6edf3', transition: 'all 0.2s ease', backdropFilter: 'blur(12px)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sub.color; e.currentTarget.style.boxShadow = `0 0 20px ${sub.color}22`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(22,27,34,0.98)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(22,27,34,0.85)' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${sub.color}18`, border: `1px solid ${sub.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={sub.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e6edf3' }}>{sub.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: 3 }}>Year-wise board papers</div>
                </div>
                <ChevronRight size={16} color="#8b949e" style={{ flexShrink: 0 }} />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .cbse-pyq-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cbse-pyq-wrap { padding: 36px 16px 48px !important; }
          .cbse-pyq-wrap h1 { font-size: 2.2rem !important; }
        }
      `}</style>
    </div>
  )
}
