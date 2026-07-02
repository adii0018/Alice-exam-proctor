import { useRef, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink, Eye, EyeOff, BookOpen, FlaskConical, Globe, Languages, BookText, Monitor } from 'lucide-react'
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

function toDownloadUrl(url) {
  const match = url?.match(/\/d\/([^/]+)/)
  if (!match) return url
  return `https://drive.google.com/uc?export=download&id=${match[1]}`
}

function toEmbedUrl(shareUrl) {
  if (!shareUrl) return null
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://drive.google.com/file/d/${match[1]}/preview`
}

const ACCENT = '#79c0ff'

const SUBJECT_META = {
  math:    { label: 'Mathematics',           icon: BookOpen,     color: '#f0883e' },
  science: { label: 'Science',               icon: FlaskConical, color: '#3fb950' },
  sst:     { label: 'Social Science',        icon: Globe,        color: '#79c0ff' },
  hindi:   { label: 'Hindi',                 icon: Languages,    color: '#d2a8ff' },
  english: { label: 'English',               icon: BookText,     color: '#ffa657' },
  it:      { label: 'Information Technology',icon: Monitor,      color: '#56d364' },
}

// Add Google Drive links here when available
const PYQ_DATA = {
  'class-10': {
    math:    [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1nsgEhYquIZsfjZiKo5oUs82kdqoLCJUh/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1edqIqImVmULuchLQm4Vik3Vq-7Yx5euv/view?usp=sharing' }, { year: '2026 (Paper C)', url: 'https://drive.google.com/file/d/1edqIqImVmULuchLQm4Vik3Vq-7Yx5euv/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    science: [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1sy5xwac0dqLG8ZOkPHQKKIynOitlBmaV/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/16Fr0p3JOZa-DvdPlPb2XmtRhxH7-Jvsb/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    sst:     [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1XeoD-20AB-0g7l-PGMiph9wReCc_3EaD/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1yGR8czzYA6IvT3zUo2MaR1SqZeZyOEKs/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    hindi:   [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1t9D5wBMGPO4ajdtgc7djZ4cHdeu3DIoT/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1EOizMO8dCwoEeUa9fMOsDASAXddcYOx-/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    english: [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1JTwM8VtjOC-jRYL5mhDyEfhjX58XLvnN/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1NUY1kjTGBqtcjN7-V-nlrBx8xkuYCd8W/view?usp=sharing' }, { year: '2026 (Paper C)', url: 'https://drive.google.com/file/d/1jTzJnAZ6pbbB-ahsv2YThORe7K53-q2m/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    it:      [{ year: '2026', url: 'https://drive.google.com/file/d/1KxYR48yR5gXUyTvtoVbrlaQYBVCj1lhd/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }],
  },
  'class-12': {
    math:    [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1nsgEhYquIZsfjZiKo5oUs82kdqoLCJUh/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1edqIqImVmULuchLQm4Vik3Vq-7Yx5euv/view?usp=sharing' }, { year: '2026 (Paper C)', url: 'https://drive.google.com/file/d/1edqIqImVmULuchLQm4Vik3Vq-7Yx5euv/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    science: [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1sy5xwac0dqLG8ZOkPHQKKIynOitlBmaV/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/16Fr0p3JOZa-DvdPlPb2XmtRhxH7-Jvsb/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    sst:     [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1XeoD-20AB-0g7l-PGMiph9wReCc_3EaD/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1yGR8czzYA6IvT3zUo2MaR1SqZeZyOEKs/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    hindi:   [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1t9D5wBMGPO4ajdtgc7djZ4cHdeu3DIoT/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1EOizMO8dCwoEeUa9fMOsDASAXddcYOx-/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    english: [{ year: '2026 (Paper A)', url: 'https://drive.google.com/file/d/1JTwM8VtjOC-jRYL5mhDyEfhjX58XLvnN/view?usp=sharing' }, { year: '2026 (Paper B)', url: 'https://drive.google.com/file/d/1NUY1kjTGBqtcjN7-V-nlrBx8xkuYCd8W/view?usp=sharing' }, { year: '2026 (Paper C)', url: 'https://drive.google.com/file/d/1jTzJnAZ6pbbB-ahsv2YThORe7K53-q2m/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }, { year: '2022', url: null }, { year: '2021', url: null }],
    it:      [{ year: '2026', url: 'https://drive.google.com/file/d/1KxYR48yR5gXUyTvtoVbrlaQYBVCj1lhd/view?usp=sharing' }, { year: '2024', url: null }, { year: '2023', url: null }],
  },
}

const CLASS_LABELS = { 'class-10': 'Class 10', 'class-12': 'Class 12' }

export default function CBSEPYQDetail() {
  const { classKey, subjectKey } = useParams()
  const [previewItem, setPreviewItem] = useState(null)
  const subject = SUBJECT_META[subjectKey]
  const papers = PYQ_DATA[classKey]?.[subjectKey] || []
  const classLabel = CLASS_LABELS[classKey] || 'CBSE'

  if (!subject) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2>Subject not found</h2>
        <Link to="/cbse" style={{ color: ACCENT }}>← Back to CBSE</Link>
      </div>
    )
  }

  const Icon = subject.icon

  function openPreview(url, year, label) {
    const embedUrl = toEmbedUrl(url)
    if (embedUrl) setPreviewItem({ url: embedUrl, originalUrl: url, year, label })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <StarField />

      {/* PDF Preview Modal */}
      {previewItem && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 3vw, 20px)' }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, width: '100%', maxWidth: 900, height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
              <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>📄 {previewItem.label} — {previewItem.year} Preview</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a href={previewItem.originalUrl} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                  <ExternalLink size={13} /> Open in Drive
                </a>
                <button onClick={() => setPreviewItem(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
              </div>
            </div>
            <iframe
              src={previewItem.url}
              title={`${previewItem.label} ${previewItem.year} PYQ`}
              style={{ flex: 1, border: 'none', width: '100%', minHeight: 0 }}
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Navbar */}
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

      <div className="cbse-pyqd-wrap" style={{ position: 'relative', zIndex: 1, flex: 1, maxWidth: 800, width: '100%', margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Back */}
        <Link to={`/cbse/${classKey}/pyq`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8b949e', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginBottom: 28, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = ACCENT}
          onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}>
          <ArrowLeft size={15} /> Back to Subjects
        </Link>

        {/* Subject Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36, padding: '20px 24px', background: 'rgba(22,27,34,0.85)', border: '1px solid #30363d', borderRadius: 14, backdropFilter: 'blur(12px)' }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: `${subject.color}18`, border: `1px solid ${subject.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} color={subject.color} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#e6edf3' }}>{subject.label}</div>
            <div style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: 4 }}>
              CBSE {classLabel} — Previous Year Question Papers
            </div>
          </div>
          <div style={{ marginLeft: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center', background: 'rgba(121,192,255,0.1)', border: '1px solid rgba(121,192,255,0.25)', color: ACCENT, fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            PYQ Papers
          </div>
        </div>

        {/* Papers List */}
        <div style={{ background: 'rgba(22,27,34,0.85)', border: '1px solid #30363d', borderRadius: 14, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262d', background: 'rgba(33,38,45,0.6)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1 }}>Year-wise Papers</div>
          </div>

          {papers.map((p, pIdx) => (
            <div key={pIdx} className="cbse-pyq-paper-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(13,17,23,0.6)', borderBottom: pIdx !== papers.length - 1 ? '1px solid #21262d' : 'none', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: p.url ? `${subject.color}15` : 'rgba(139,148,158,0.06)', border: `1px solid ${p.url ? subject.color + '33' : '#21262d'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: p.url ? subject.color : '#484f58' }}>{p.year.slice(0, 4)}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: p.url ? '#e6edf3' : '#8b949e' }}>
                    {subject.label} — {p.year}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#484f58', marginTop: 2 }}>CBSE Board Examination Paper</div>
                </div>
              </div>

              {p.url ? (
                <div className="cbse-pyq-paper-buttons" style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <a href={toDownloadUrl(p.url)} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 16px', background: `${subject.color}15`, border: `1px solid ${subject.color}44`, borderRadius: 6, color: subject.color, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${subject.color}25`; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${subject.color}15`; e.currentTarget.style.transform = 'translateY(0)' }}>
                    <Download size={13} /> Download
                  </a>
                  <button onClick={() => openPreview(p.url, p.year, subject.label)}
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 16px', background: 'rgba(139,148,158,0.08)', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.color = '#e6edf3' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e' }}>
                    <ExternalLink size={13} /> Preview
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#484f58', fontWeight: 500, background: 'rgba(139,148,158,0.06)', border: '1px solid #21262d', padding: '6px 14px', borderRadius: 6 }}>Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .cbse-detail-wrap { padding: 28px 16px 48px !important; }
          .cbse-detail-wrap h1 { font-size: 1.8rem !important; }
          .cbse-detail-wrap p { font-size: 0.85rem !important; }
        }
        @media (max-width: 480px) {
          .cbse-pyq-paper-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .cbse-pyq-paper-buttons { width: 100% !important; display: flex !important; gap: 8px !important; }
          .cbse-pyq-paper-buttons a, .cbse-pyq-paper-buttons button { flex: 1 !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  )
}
