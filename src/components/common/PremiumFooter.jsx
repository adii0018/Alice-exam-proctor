import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ── Typewriter cycling name ───────────────────────────────────────────────────
function TypewriterName() {
  const titles = ['Aditya Singh Rajput ', 'A   S   R ', 'AI Enthusiast']
  const [titleIdx, setTitleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false) }, 1600)
      return () => clearTimeout(t)
    }
    const current = titles[titleIdx]
    if (!deleting) {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75)
        return () => clearTimeout(t)
      } else {
        setPaused(true)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
        return () => clearTimeout(t)
      } else {
        setDeleting(false)
        setTitleIdx(i => (i + 1) % titles.length)
      }
    }
  }, [displayed, deleting, paused, titleIdx])

  return (
    <a
      href="https://github.com/adii0018"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}
    >
      <span style={{
        fontSize: '0.78rem', fontWeight: 700,
        background: 'linear-gradient(90deg, #3fb950, #58a6ff)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        letterSpacing: '0.01em', minWidth: 148, display: 'inline-block',
      }}>
        {displayed}
      </span>
      <span style={{
        display: 'inline-block', width: 2, height: '0.85em',
        background: '#3fb950', borderRadius: 1, marginLeft: 1,
        animation: 'cursorBlink 0.8s step-end infinite',
        verticalAlign: 'middle', flexShrink: 0,
      }} />
    </a>
  )
}

// ── Alice logo ────────────────────────────────────────────────────────────────
function AliceLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/adii0018', label: 'GitHub',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    href: 'https://www.linkedin.com/in/aditya-singh-rajput-720aa8326', label: 'LinkedIn',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/></svg>,
  },
  {
    href: 'https://www.instagram.com/http._.adiix', label: 'Instagram',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
]

const CAPABILITIES = [
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"/></svg>, text: 'Gaze Tracking' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'Multi-Face Detection' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, text: 'Live Monitoring' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: 'E2E Encryption' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, text: 'AI Behavioral Analysis' },
  { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, text: 'Violation Reports' },
]

const TECH_STACK = ['React 18', 'Django', 'WebSocket', 'TensorFlow.js', 'Python 3.11', 'SQLite']

export default function PremiumFooter() {
  return (
    <footer style={{
      position: 'relative',
      background: 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
      borderTop: '1px solid #21262d',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
    }}>
      <style>{`
        .footer-watermark {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: clamp(5rem, 18vw, 16rem);
          font-weight: 900; letter-spacing: -0.04em;
          white-space: nowrap; pointer-events: none; user-select: none; z-index: 0;
          background: linear-gradient(180deg, rgba(230,237,243,0.055) 0%, rgba(230,237,243,0.02) 60%, transparent 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          filter: blur(0.5px); line-height: 1;
        }
        @media (max-width: 768px) { .footer-watermark { font-size: clamp(3.5rem, 22vw, 7rem); } }

        .footer-main-grid {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 64px;
          margin-bottom: 56px; align-items: start;
        }
        @media (max-width: 768px) { .footer-main-grid { grid-template-columns: 1fr; gap: 40px; } }

        .footer-caps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 24px;
        }
        @media (max-width: 500px) { .footer-caps-grid { grid-template-columns: repeat(2, 1fr); } }

        .footer-social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid #30363d;
          color: #8b949e; text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .footer-social-icon:hover {
          background: rgba(63,185,80,0.1); border-color: #3fb950;
          color: #3fb950; transform: translateY(-2px);
        }

        .footer-nav-link {
          color: #8b949e; font-size: 0.83rem; text-decoration: none; transition: color 0.15s;
        }
        .footer-nav-link:hover { color: #3fb950; }

        .footer-bottom {
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 12px;
        }
        @media (max-width: 520px) { .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; } }

        .footer-cap-pill {
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.03); border: 1px solid #21262d;
          border-radius: 8px; padding: 8px 12px; color: #8b949e; font-size: 0.78rem;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .footer-cap-pill:hover {
          border-color: rgba(63,185,80,0.3); color: #c9d1d9; background: rgba(63,185,80,0.05);
        }

        .footer-cta-box {
          background: linear-gradient(135deg, rgba(46,160,67,0.08) 0%, rgba(46,160,67,0.03) 100%);
          border: 1px solid rgba(46,160,67,0.2); border-radius: 12px; padding: 28px;
        }

        .footer-gh-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #2ea043; color: #fff;
          border: 1px solid rgba(240,246,252,0.1);
          padding: 9px 20px; border-radius: 6px;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          text-decoration: none; transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          white-space: nowrap; font-family: inherit;
        }
        .footer-gh-btn:hover {
          background: #3fb950; box-shadow: 0 0 0 3px rgba(46,160,67,0.2); transform: translateY(-1px);
        }

        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      {/* Glows */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 1, background: 'linear-gradient(90deg, transparent, #3fb950, transparent)', opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 120, background: 'radial-gradient(ellipse at top, rgba(63,185,80,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Watermark */}
      <div className="footer-watermark" aria-hidden="true">Alice</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '64px 24px 32px' }}>

        {/* ── Main two-col grid ── */}
        <div className="footer-main-grid">

          {/* Left — brand + capabilities */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <AliceLogo size={32} />
              <span style={{ color: '#e6edf3', fontWeight: 400, fontSize: '1.05rem', letterSpacing: 0 }}>Alice Exam Proctor</span>
            </div>

            <p style={{ color: '#8b949e', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 380, marginBottom: 20 }}>
              An open-source AI proctoring platform that keeps online exams honest — using real-time computer vision, behavioral analysis, and zero-compromise security.
            </p>

            {/* Tech stack badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
              {TECH_STACK.map(t => (
                <span key={t} style={{
                  background: 'rgba(46,160,67,0.08)', border: '1px solid rgba(46,160,67,0.2)',
                  color: '#3fb950', fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                }}>{t}</span>
              ))}
            </div>

            {/* Capability pills */}
            <p style={{ color: '#484f58', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>What Alice does</p>
            <div className="footer-caps-grid">
              {CAPABILITIES.map(c => (
                <div key={c.text} className="footer-cap-pill">
                  <span style={{ color: '#3fb950', flexShrink: 0 }}>{c.icon}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA + contact + socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* CTA box */}
            <div className="footer-cta-box">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.25)', color: '#3fb950', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
                Free for educators
              </div>
              <h3 style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, lineHeight: 1.4 }}>
                Start proctoring in minutes
              </h3>
              <p style={{ color: '#8b949e', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: 20 }}>
                No credit card. No setup fees. Just create an exam, share the code, and let Alice handle the rest.
              </p>
              <Link to="/auth" className="footer-gh-btn">
                Get started free
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>

            {/* Contact card */}
            <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid #21262d', borderRadius: 10, padding: '20px 22px' }}>
              <p style={{ color: '#e6edf3', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Get in touch</p>
              {[
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href: 'mailto:singhrajputaditya982@gmail.com', text: 'singhrajputaditya982@gmail.com' },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>, href: 'https://github.com/adii0018', text: 'github.com/adii0018', external: true },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(46,160,67,0.08)', border: '1px solid rgba(46,160,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fb950', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="footer-nav-link" style={{ fontSize: '0.78rem' }}>
                    {item.text}
                  </a>
                </div>
              ))}

              {/* Socials */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #21262d' }}>
                {SOCIAL_LINKS.map(({ href, label, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="footer-social-icon">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #21262d 20%, #21262d 80%, transparent)', marginBottom: 28 }} />

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p style={{ color: '#484f58', fontSize: '0.78rem', margin: 0 }}>
            © {new Date().getFullYear()} Alice Exam Proctor. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950', display: 'inline-block', boxShadow: '0 0 6px rgba(63,185,80,0.6)' }} />
            <span style={{ color: '#484f58', fontSize: '0.75rem' }}>All systems operational</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#484f58', fontSize: '0.78rem' }}>Crafted with</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            <span style={{ color: '#484f58', fontSize: '0.78rem' }}>by</span>
            <TypewriterName />
          </div>
        </div>

      </div>
    </footer>
  )
}
