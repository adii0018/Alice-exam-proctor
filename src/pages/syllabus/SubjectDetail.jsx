import { useRef, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
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

export default function SubjectDetail() {
  const { year, semester, subjectId } = useParams()
  const yearData = syllabusData[year]
  const semData = yearData?.semesters?.[semester]
  const subject = semData?.subjects?.find(s => s.id === subjectId)

  if (!yearData || !semData || !subject) return <Navigate to="/syllabus" replace />

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.82rem', color: '#8b949e', flexWrap: 'wrap' }}>
          <Link to="/syllabus" style={{ color: '#8b949e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Syllabus
          </Link>
          <ChevronRight size={14} />
          <Link to={`/syllabus/${year}`} style={{ color: '#8b949e', textDecoration: 'none' }}>{YEAR_LABELS[year]}</Link>
          <ChevronRight size={14} />
          <Link to={`/syllabus/${year}/${semester}`} style={{ color: '#8b949e', textDecoration: 'none' }}>{semData.label}</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#3fb950', fontWeight: 600 }}>{subject.name.split(' - ')[1] || subject.name}</span>
        </div>

        {/* Subject Heading Card */}
        <div style={{ background: 'rgba(63,185,80,0.07)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 12, padding: 'clamp(18px, 4vw, 28px) clamp(16px, 4vw, 32px)', marginBottom: 40 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#3fb950', marginBottom: 8 }}>
            {YEAR_LABELS[year]} · {semData.label}
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, marginBottom: 12 }}>
            {subject.name}
          </h1>
          <div style={{ color: '#8b949e', fontSize: '0.875rem' }}>
            {subject.units.length} Units in this subject
          </div>
        </div>

        {/* Syllabus Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '12px 48px' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, color: '#e6edf3' }}>Syllabus</h2>
          </div>
        </div>

        {/* Units — Full Width Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subject.units.map((unit, idx) => {
            const col = BLOCK_COLORS[idx % BLOCK_COLORS.length]
            return (
              <div
                key={unit.unit}
                style={{
                  padding: 'clamp(16px, 3vw, 24px) clamp(16px, 3vw, 28px)',
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  borderLeft: `5px solid ${col.accent}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ fontWeight: 700, color: col.accent, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  UNIT {unit.unit}: {unit.title}
                </div>
                <p style={{ color: '#c9d1d9', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', lineHeight: 1.75, margin: 0 }}>
                  {unit.content}
                </p>
              </div>
            )
          })}
        </div>

        {/* Back CTA */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Link
            to={`/syllabus/${year}/${semester}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: '1px solid #30363d',
              color: '#8b949e', textDecoration: 'none', padding: '10px 24px',
              borderRadius: 8, fontSize: '0.875rem', fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3fb950'; e.currentTarget.style.color = '#3fb950' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e' }}
          >
            <ArrowLeft size={16} /> Back to Subjects
          </Link>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
        }
      `}</style>
    </div>
  )
}
