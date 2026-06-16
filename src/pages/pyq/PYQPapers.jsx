import { useRef, useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { FileText, ChevronRight, ArrowLeft, Download, ExternalLink, BookOpen } from 'lucide-react'
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

const CARD_COLORS = [
  { bg: 'rgba(121,192,255,0.07)', border: 'rgba(121,192,255,0.25)', accent: '#79c0ff', rgb: '121,192,255' },
  { bg: 'rgba(163,113,247,0.07)', border: 'rgba(163,113,247,0.25)', accent: '#a371f7', rgb: '163,113,247' },
  { bg: 'rgba(63,185,80,0.07)',   border: 'rgba(63,185,80,0.25)',   accent: '#3fb950', rgb: '63,185,80'   },
  { bg: 'rgba(210,153,34,0.07)',  border: 'rgba(210,153,34,0.25)',  accent: '#e3b341', rgb: '210,153,34'  },
  { bg: 'rgba(248,81,73,0.07)',   border: 'rgba(248,81,73,0.25)',   accent: '#f85149', rgb: '248,81,73'   },
]

// Converts a Google Drive share URL to a direct preview URL
function drivePreviewLink(link) {
  if (!link || link === 'PASTE_LINK_HERE') return null
  // Handle formats: /file/d/ID/view or /open?id=ID
  const m = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`
  return link
}

function driveDownloadLink(link) {
  if (!link || link === 'PASTE_LINK_HERE') return null
  const m = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`
  return link
}

export default function PYQPapers() {
  const { year, semester } = useParams()
  const [activeSubject, setActiveSubject] = useState(null)
  const [previewLink, setPreviewLink] = useState(null)

  const yearData = pyqData[year]
  if (!yearData) return <Navigate to="/pyq" replace />

  const semData = yearData.semesters[Number(semester)]
  if (!semData) return <Navigate to={`/pyq/${year}`} replace />

  const subjects = semData.subjects

  function openPreview(link) {
    const pLink = drivePreviewLink(link)
    if (pLink) setPreviewLink(pLink)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', position: 'relative' }}>
      <StarField />

      {/* PDF Preview Modal */}
      {previewLink && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 3vw, 20px)' }}
          onClick={() => setPreviewLink(null)}
        >
          <div
            style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, width: '100%', maxWidth: 900, height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
              <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>📄 Paper Preview</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a href={previewLink.replace('/preview', '/view')} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                  <ExternalLink size={13} /> Open in Drive
                </a>
                <button onClick={() => setPreviewLink(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '0 4px' }}>✕</button>
              </div>
            </div>
            <iframe
              src={previewLink}
              title="PDF Preview"
              style={{ flex: 1, border: 'none', width: '100%', minHeight: 0 }}
              allow="autoplay"
            />
          </div>
        </div>
      )}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/pyq" style={{ color: '#8b949e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> PYQ Home
          </Link>
          <ChevronRight size={14} color="#8b949e" />
          <Link to={`/pyq/${year}`} style={{ color: '#8b949e', textDecoration: 'none' }}>{yearData.label}</Link>
          <ChevronRight size={14} color="#8b949e" />
          <span style={{ color: ACCENT, fontWeight: 600 }}>{semData.label}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
          {yearData.label} — <span style={{ color: ACCENT }}>{semData.label}</span>
        </h1>
        <p style={{ color: '#8b949e', marginBottom: 40 }}>
          {subjects.length} subjects • Click a paper to preview or download
        </p>

        {/* Subject Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subjects.map((subject, idx) => {
            const color = CARD_COLORS[idx % CARD_COLORS.length]
            const isOpen = activeSubject === subject.id
            const hasLinks = subject.papers?.some(p => p.link && p.link !== 'PASTE_LINK_HERE')

            return (
              <div
                key={subject.id}
                style={{
                  background: isOpen ? color.bg : 'rgba(22,27,34,0.8)',
                  border: `1px solid ${isOpen ? color.border : '#30363d'}`,
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? `0 4px 20px rgba(${color.rgb},0.1)` : 'none',
                }}
              >
                {/* Subject Header — clickable to expand */}
                <button
                  onClick={() => setActiveSubject(isOpen ? null : subject.id)}
                  className="pyq-subject-header"
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 18px', color: '#e6edf3', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `rgba(${color.rgb},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={16} color={color.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="pyq-subject-header-title" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e6edf3', wordBreak: 'break-word', lineHeight: 1.4 }}>{subject.name}</div>
                      <div style={{ fontSize: '0.73rem', color: '#8b949e', marginTop: 2 }}>
                        {subject.papers?.length || 0} papers
                        {!hasLinks && <span style={{ color: '#e3b341', marginLeft: 8 }}>• Links coming soon</span>}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    color={color.accent}
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
                  />
                </button>

                {/* Papers List — visible when expanded */}
                {isOpen && (
                  <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                    {/* 📁 Drive Folder Banner — shown if folderLink exists */}
                    {subject.folderLink && (
                      <a
                        href={subject.folderLink}
                        target="_blank"
                        rel="noreferrer"
                        className="pyq-drive-banner"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: `linear-gradient(135deg, rgba(${color.rgb},0.12) 0%, rgba(${color.rgb},0.05) 100%)`,
                          border: `1px solid ${color.border}`,
                          borderRadius: 8, padding: '14px 18px',
                          textDecoration: 'none', gap: 12,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `rgba(${color.rgb},0.18)`; e.currentTarget.style.transform = 'translateX(3px)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(${color.rgb},0.12) 0%, rgba(${color.rgb},0.05) 100%)`; e.currentTarget.style.transform = 'translateX(0)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.3rem' }}>📁</span>
                          <div>
                            <div style={{ fontWeight: 700, color: color.accent, fontSize: '0.9rem' }}>Browse All Papers in Google Drive</div>
                            <div className="pyq-drive-banner-sub" style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: 2 }}>Open the complete folder — all available years in one place</div>
                          </div>
                        </div>
                        <ExternalLink size={16} color={color.accent} style={{ flexShrink: 0 }} />
                      </a>
                    )}

                    {subject.folderLink && subject.papers?.some(p => p.link && p.link !== 'PASTE_LINK_HERE') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
                        <div style={{ flex: 1, height: 1, background: '#21262d' }} />
                        <span style={{ color: '#484f58', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>or individual papers below</span>
                        <div style={{ flex: 1, height: 1, background: '#21262d' }} />
                      </div>
                    )}
                    {(subject.papers || []).map((paper, pIdx) => {
                      const hasLink = paper.link && paper.link !== 'PASTE_LINK_HERE'
                      const downloadUrl = driveDownloadLink(paper.link)
                      const previewUrl = drivePreviewLink(paper.link)

                      return (
                        <div
                          key={pIdx}
                          className="pyq-paper-row"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'rgba(13,17,23,0.7)',
                            border: '1px solid #21262d',
                            borderRadius: 8,
                            padding: '10px 14px',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                            <FileText size={16} color={hasLink ? color.accent : '#484f58'} style={{ flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <span style={{ fontWeight: 600, fontSize: 'clamp(0.82rem, 2vw, 0.9rem)', color: hasLink ? '#e6edf3' : '#484f58', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {paper.year} — {paper.exam}
                              </span>
                            </div>
                          </div>
                          <div className="pyq-paper-buttons" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            {hasLink ? (
                              <>
                                <button
                                  onClick={() => openPreview(paper.link)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: `rgba(${color.rgb},0.1)`,
                                    border: `1px solid ${color.border}`,
                                    color: color.accent,
                                    borderRadius: 6,
                                    padding: '6px 12px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = `rgba(${color.rgb},0.2)`}
                                  onMouseLeave={e => e.currentTarget.style.background = `rgba(${color.rgb},0.1)`}
                                >
                                  <ExternalLink size={12} /> Preview
                                </button>
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: color.accent,
                                    color: '#0d1117',
                                    borderRadius: 6,
                                    padding: '6px 12px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    transition: 'opacity 0.15s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                  <Download size={12} /> Download
                                </a>
                              </>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#484f58', padding: '6px 12px', border: '1px solid #21262d', borderRadius: 6 }}>
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div style={{ marginTop: 40, padding: '14px 16px', background: 'rgba(121,192,255,0.05)', border: '1px solid rgba(121,192,255,0.15)', borderRadius: 8 }}>
          <p style={{ color: '#8b949e', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>
            💡 <strong style={{ color: '#79c0ff' }}>Tip:</strong> All papers open directly from Google Drive. If a paper shows "Coming Soon", the link will be added soon.
          </p>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          .alice-brand-text { display: none !important; }
          .pyq-paper-row { padding: 10px 12px !important; }
          .pyq-paper-buttons { width: 100% !important; margin-top: 2px !important; }
          .pyq-paper-buttons a,
          .pyq-paper-buttons button { flex: 1 !important; justify-content: center !important; }
        }
        @media (max-width: 400px) {
          .pyq-paper-row { flex-direction: column !important; align-items: flex-start !important; }
          .pyq-paper-buttons { margin-top: 8px !important; }
          .pyq-subject-header { padding: 14px 14px !important; }
          .pyq-subject-header-title { font-size: 0.85rem !important; }
          .pyq-drive-banner { padding: 12px 14px !important; }
          .pyq-drive-banner-sub { display: none !important; }
        }
      `}</style>
    </div>
  )
}
