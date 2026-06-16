import { useRef, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { FileText, ChevronRight, ArrowLeft } from 'lucide-react'
import { pyqData } from './data'

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

const ACCENT = '#79c0ff'

const SEM_COLORS = [
  { bg: 'rgba(121,192,255,0.08)', border: 'rgba(121,192,255,0.3)', accent: '#79c0ff' },
  { bg: 'rgba(163,113,247,0.08)', border: 'rgba(163,113,247,0.3)', accent: '#a371f7' },
  { bg: 'rgba(63,185,80,0.08)',   border: 'rgba(63,185,80,0.3)',   accent: '#3fb950' },
  { bg: 'rgba(210,153,34,0.08)',  border: 'rgba(210,153,34,0.3)',  accent: '#e3b341' },
]

export default function PYQSemester() {
  const { year } = useParams()
  const yearData = pyqData[year]
  if (!yearData) return <Navigate to="/pyq" replace />

  const semesters = Object.entries(yearData.semesters)

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative' }}>
      <StarField />

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontSize: '1.4rem' }}>🍃</span>
            <span className="alice-brand-text" style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/syllabus" style={{ color: '#3fb950', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Syllabus</Link>
            <Link to="/pyq" style={{ color: ACCENT, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>PYQ Papers</Link>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.85rem' }}>
          <Link to="/pyq" style={{ color: '#8b949e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> PYQ Home
          </Link>
          <ChevronRight size={14} color="#8b949e" />
          <span style={{ color: ACCENT, fontWeight: 600 }}>{yearData.label}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
          {yearData.label} — <span style={{ color: ACCENT }}>PYQ Papers</span>
        </h1>
        <p style={{ color: '#8b949e', marginBottom: 48 }}>Select a semester to browse available papers</p>

        {/* Semester Cards */}
        <div className="pyq-sem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {semesters.map(([semNum, semData], idx) => {
            const color = SEM_COLORS[idx % SEM_COLORS.length]
            const paperCount = semData.subjects.reduce((acc, s) => acc + (s.papers?.length || 0), 0)
            return (
              <Link
                key={semNum}
                to={`/pyq/${year}/${semNum}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: color.bg,
                  border: `1px solid ${color.border}`,
                  borderRadius: 12,
                  padding: '28px 24px',
                  transition: 'all 0.22s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`
                  e.currentTarget.style.borderColor = color.accent
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = color.border
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(${color.accent === '#79c0ff' ? '121,192,255' : color.accent === '#a371f7' ? '163,113,247' : color.accent === '#3fb950' ? '63,185,80' : '210,153,34'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color={color.accent} />
                  </div>
                  <ChevronRight size={18} color={color.accent} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>
                  {semData.label}
                </h3>
                <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: 16 }}>
                  {semData.subjects.length} Subjects
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: `rgba(${color.accent === '#79c0ff' ? '121,192,255' : color.accent === '#a371f7' ? '163,113,247' : color.accent === '#3fb950' ? '63,185,80' : '210,153,34'},0.1)`, color: color.accent, fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${color.border}` }}>
                    {paperCount} Papers Available
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .pyq-sem-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
        }
        @media (max-width: 480px) {
          .pyq-sem-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        }
        @media (max-width: 360px) {
          .pyq-sem-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
