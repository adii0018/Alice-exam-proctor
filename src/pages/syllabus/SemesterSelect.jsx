import { useRef, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { syllabusData } from './data'

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

const YEAR_LABELS = {
  'first-year':  'First Year',
  'second-year': 'Second Year',
  'third-year':  'Third Year',
  'fourth-year': 'Fourth Year',
}

const SEM_COLORS = [
  { bg: 'rgba(63,185,80,0.08)',   border: 'rgba(63,185,80,0.5)',   accent: '#3fb950', glow: 'rgba(63,185,80,0.2)' },
  { bg: 'rgba(121,192,255,0.08)', border: 'rgba(121,192,255,0.5)', accent: '#79c0ff', glow: 'rgba(121,192,255,0.2)' },
]

export default function SemesterSelect() {
  const { year } = useParams()
  const yearData = syllabusData[year]

  if (!yearData) return <Navigate to="/syllabus" replace />

  const semesters = Object.entries(yearData.semesters)

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative' }}>
      <StarField />

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>🍃</span>
            <span style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
          </Link>
          <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.875rem' }}>Sign in</Link>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.85rem', color: '#8b949e', flexWrap: 'wrap' }}>
          <Link to="/syllabus" style={{ color: '#8b949e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Syllabus
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#3fb950', fontWeight: 600 }}>{YEAR_LABELS[year]}</span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
          {YEAR_LABELS[year]}
        </h1>
        <p style={{ color: '#8b949e', marginBottom: 40, fontSize: '0.95rem' }}>
          Select a semester to view its subjects and syllabus.
        </p>

        {/* Semester Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {semesters.map(([semNum, semData], idx) => {
            const col = SEM_COLORS[idx % SEM_COLORS.length]
            return (
              <Link
                key={semNum}
                to={`/syllabus/${year}/${semNum}`}
                style={{
                  display: 'block',
                  padding: '32px 28px',
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 12px 32px ${col.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: col.accent, marginBottom: 10 }}>
                  Semester {semNum}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>
                  {semData.label}
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: 20 }}>
                  {semData.subjects.length} Subjects
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: col.accent, fontSize: '0.875rem', fontWeight: 600 }}>
                  View Subjects <ChevronRight size={16} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
