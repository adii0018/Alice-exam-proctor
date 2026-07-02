import { useRef, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink, Eye, EyeOff, FileText, BookOpen, FlaskConical, Globe, Languages, BookText, Monitor, AlertCircle } from 'lucide-react'
import AliceLogo from '../../components/common/AliceLogo'
import ITSyllabusContent from './ITSyllabusContent'

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

// Helper: convert Google Drive share link → embed URL
function toEmbedUrl(shareUrl) {
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://drive.google.com/file/d/${match[1]}/preview`
}
function toDownloadUrl(shareUrl) {
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return shareUrl
  return `https://drive.google.com/uc?export=download&id=${match[1]}`
}

// PYQ papers data per subject (add driveUrl when available)
const PYQ_DATA = {
  'class-10': {
    math:    { label: 'Mathematics',           pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    science: { label: 'Science',               pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    sst:     { label: 'Social Science',        pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    hindi:   { label: 'Hindi',                 pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    english: { label: 'English',               pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    it:      { label: 'Information Technology',pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }] },
  },
  'class-12': {
    math:    { label: 'Mathematics',           pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    science: { label: 'Science',               pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    sst:     { label: 'Social Science',        pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    hindi:   { label: 'Hindi',                 pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    english: { label: 'English',               pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }] },
    it:      { label: 'Information Technology',pyqs: [{ year: '2024', url: null }, { year: '2023', url: null }] },
  },
}

const SUBJECT_DATA = {
  'class-10': {
    math: {
      label: 'Mathematics',
      icon: BookOpen,
      color: '#f0883e',
      driveUrl: 'https://drive.google.com/file/d/111xIeuFS1Uw58zg9a-inxzRx56tbGQrt/view?usp=sharing',
    },
    science: {
      label: 'Science',
      icon: FlaskConical,
      color: '#3fb950',
      driveUrl: 'https://drive.google.com/file/d/1ODMkiMM1SREzI-i0B3BTeiVnUt4wKZDp/view?usp=sharing',
    },
    sst: {
      label: 'Social Science',
      icon: Globe,
      color: '#79c0ff',
      driveUrl: 'https://drive.google.com/file/d/1V03XH3aZIwJVyrqpEDuWN-hTmauR8uRT/view?usp=sharing',
    },
    hindi: {
      label: 'Hindi',
      icon: Languages,
      color: '#d2a8ff',
      driveUrl: 'https://drive.google.com/file/d/1dVdzL3cVWJr7vQj9WEjC6Jq3ZbwSdTvA/view?usp=sharing',
    },
    english: {
      label: 'English',
      icon: BookText,
      color: '#ffa657',
      driveUrl: 'https://drive.google.com/file/d/1iuXaFDKQ9flf3BOFLuLcVIsbNRdXDNYx/view?usp=sharing',
    },
    it: {
      label: 'Information Technology',
      icon: Monitor,
      color: '#56d364',
      driveUrl: null,
    },
  },
}

export default function CBSESubjectDetail() {
  const { classKey, subjectKey } = useParams()
  const [showPreview, setShowPreview] = useState(false)
  const classData = SUBJECT_DATA[classKey]
  const subject = classData?.[subjectKey]

  if (!subject) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2>Subject not found</h2>
        <Link to={`/cbse/${classKey}`} style={{ color: ACCENT }}>← Go Back</Link>
      </div>
    )
  }

  const Icon = subject.icon
  const embedUrl = subject.driveUrl ? toEmbedUrl(subject.driveUrl) : null
  const downloadUrl = subject.driveUrl ? toDownloadUrl(subject.driveUrl) : null

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
          <div className="cbse-tab-nav" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to={`/cbse/${classKey}/pyq`} style={{ color: '#79c0ff', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>PYQ Papers</Link>
            <Link to="/auth" style={{ color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem' }}>Sign in</Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="cbse-detail-wrap" style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 900, width: '100%', margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Back */}
        <Link
          to={`/cbse/${classKey}/syllabus`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8b949e', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginBottom: 28, transition: 'color 0.2s', width: 'fit-content' }}
          onMouseEnter={e => e.currentTarget.style.color = ACCENT}
          onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}
        >
          <ArrowLeft size={15} /> Back to Subjects
        </Link>

        {/* Subject header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: `${subject.color}18`, border: `1px solid ${subject.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} color={subject.color} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                CBSE Class 10 · Syllabus
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, margin: 0 }}>
                {subject.label}
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          {subject.driveUrl && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: `${subject.color}18`, border: `1px solid ${subject.color}55`, borderRadius: 8, color: subject.color, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${subject.color}28`; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = `${subject.color}18`; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <Download size={14} /> Download PDF
              </a>
              <a
                href={subject.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'rgba(139,148,158,0.1)', border: '1px solid #30363d', borderRadius: 8, color: '#8b949e', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.color = '#e6edf3'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <ExternalLink size={14} /> Open in Drive
              </a>
              <button
                onClick={() => setShowPreview(p => !p)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: showPreview ? 'rgba(139,148,158,0.18)' : 'rgba(139,148,158,0.08)', border: '1px solid #30363d', borderRadius: 8, color: showPreview ? '#e6edf3' : '#8b949e', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.color = '#e6edf3' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = showPreview ? '#e6edf3' : '#8b949e' }}
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
          )}
        </div>

        {/* PDF Viewer — only when Preview is clicked */}
        {embedUrl && showPreview && (
          <div style={{
            background: 'rgba(22,27,34,0.85)',
            border: '1px solid #30363d',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            marginTop: 8,
          }}>
            {/* Viewer topbar */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ color: '#8b949e', fontSize: '0.75rem', marginLeft: 4 }}>
                  {subject.label} — Syllabus PDF
                </span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = '#e6edf3'}
                onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}
              >
                <EyeOff size={13} /> Close Preview
              </button>
            </div>
            {/* Iframe */}
            <iframe
              src={embedUrl}
              title={`${subject.label} Syllabus`}
              allow="autoplay"
              style={{ width: '100%', height: '75vh', minHeight: 500, border: 'none', display: 'block', background: '#fff' }}
            />
          </div>
        )}

        {/* Custom Content or Coming Soon */}
        {!subject.driveUrl && subjectKey === 'it' ? (
          <ITSyllabusContent />
        ) : !subject.driveUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(22,27,34,0.85)', border: '1px solid #30363d', borderRadius: 14, padding: '80px 24px', backdropFilter: 'blur(12px)', textAlign: 'center', marginTop: 8 }}>
            <AlertCircle size={40} color={subject.color} style={{ opacity: 0.7 }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e6edf3' }}>Syllabus Coming Soon</div>
            <div style={{ color: '#8b949e', fontSize: '0.9rem', maxWidth: 340 }}>
              The syllabus PDF for {subject.label} will be uploaded soon. Check back later!
            </div>
            <Link
              to={`/cbse/${classKey}`}
              style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, color: ACCENT, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
            >
              <ArrowLeft size={14} /> Browse other subjects
            </Link>
          </div>
        )}



      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .cbse-detail-wrap { padding: 28px 16px 48px !important; }
          .cbse-detail-wrap h1 { font-size: 1.8rem !important; }
          .cbse-detail-wrap p { font-size: 0.85rem !important; }
          .cbse-tab-nav { flex-wrap: wrap !important; gap: 8px !important; }
          .cbse-tab-nav button { flex: 1 !important; justify-content: center !important; font-size: 0.8rem !important; padding: 10px !important; }
        }
      `}</style>
    </div>
  )
}
