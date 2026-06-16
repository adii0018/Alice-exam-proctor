import { useRef, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft, BookOpen } from 'lucide-react'
import { syllabusData, BLOCK_COLORS } from './data'

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

export default function SubjectsList() {
  const { year, semester } = useParams()
  const yearData = syllabusData[year]
  const semData = yearData?.semesters?.[semester]

  if (!yearData || !semData) return <Navigate to="/syllabus" replace />

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative' }}>
      <StarField />

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,17,23,0.95)', borderBottom: '1px solid #21262d', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>🍃</span>
            <span className="alice-brand-text" style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem' }}>Alice Exam Proctor</span>
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
          <Link to={`/syllabus/${year}`} style={{ color: '#8b949e', textDecoration: 'none' }}>
            {YEAR_LABELS[year]}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#3fb950', fontWeight: 600 }}>{semData.label}</span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
          {YEAR_LABELS[year]} — {semData.label}
        </h1>
        <p style={{ color: '#8b949e', marginBottom: 40, fontSize: '0.95rem' }}>
          {semData.subjects.length} subjects · Click on a subject to view its complete syllabus.
        </p>

        {/* Subjects Full-Width List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {semData.subjects.map((subject, idx) => {
            const col = BLOCK_COLORS[idx % BLOCK_COLORS.length]
            return (
              <Link
                key={subject.id}
                to={`/syllabus/${year}/${semester}/${subject.id}`}
                className="subject-link-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  borderLeft: `4px solid ${col.accent}`,
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  gap: 16,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(6px)'
                  e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`
                  e.currentTarget.style.background = `rgba(${col.accent === '#3fb950' ? '63,185,80' : col.accent === '#79c0ff' ? '121,192,255' : col.accent === '#e3b341' ? '227,179,65' : col.accent === '#f85149' ? '248,81,73' : '163,113,247'},0.15)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = col.bg
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                  <div style={{ background: `rgba(${col.accent === '#3fb950' ? '63,185,80' : col.accent === '#79c0ff' ? '121,192,255' : col.accent === '#e3b341' ? '227,179,65' : col.accent === '#f85149' ? '248,81,73' : '163,113,247'},0.15)`, borderRadius: 8, padding: 10, flexShrink: 0 }}>
                    <BookOpen size={20} color={col.accent} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: col.accent, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                      Subject
                    </div>
                    <div style={{ color: '#e6edf3', fontWeight: 600, fontSize: 'clamp(0.875rem, 2vw, 1rem)', lineHeight: 1.4 }}>
                      {subject.name}
                    </div>
                    <div style={{ color: '#8b949e', fontSize: '0.78rem', marginTop: 4 }}>
                      {subject.units.length} Units
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color={col.accent} style={{ flexShrink: 0 }} />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .subject-link-card { padding: 14px 16px !important; }
          .subject-icon-box { padding: 8px !important; }
        }
        @media (max-width: 380px) {
          .subject-link-card { padding: 12px !important; }
        }
      `}</style>
    </div>
  )
}
