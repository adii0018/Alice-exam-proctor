import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import TestimonialsSection from '../components/common/TestimonialsSection'
import AliceAIShowcase from '../components/common/AliceAIShowcase'
import PremiumFooter from '../components/common/PremiumFooter'

// ── Alice logo — leaf, GitHub dark theme ─────────────────────────────────────
function AliceLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Dark background */}
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>

      {/* Right leaf lobe */}
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z"
            fill="#3fb950" opacity="0.95"/>

      {/* Left leaf lobe (darker) */}
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z"
            fill="#2ea043" opacity="0.7"/>

      {/* Center vein */}
      <line x1="50" y1="22" x2="50" y2="78"
            stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>

      {/* Stem */}
      <path d="M50 82 Q48 89 44 93"
            fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Star field canvas ─────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth
    let H = document.documentElement.scrollHeight

    // generate stars once
    const COUNT = Math.floor((W * H) / 6000)
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,          // radius 0.2–1.4
      base: Math.random() * 0.5 + 0.15,       // base opacity 0.15–0.65
      speed: Math.random() * 0.008 + 0.003,   // twinkle speed
      phase: Math.random() * Math.PI * 2,     // twinkle offset
    }))

    // a handful of slightly larger "bright" stars
    const BRIGHT = Math.floor(COUNT * 0.06)
    for (let i = 0; i < BRIGHT; i++) {
      stars[i].r = Math.random() * 1.6 + 1.0
      stars[i].base = Math.random() * 0.4 + 0.4
    }

    function resize() {
      W = window.innerWidth
      H = document.documentElement.scrollHeight
      canvas.width = W
      canvas.height = H
      // redraw static stars after resize
      drawStars()
    }

    function drawStars() {
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${s.base})`
        ctx.fill()
      }
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(document.documentElement)

    return () => {
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        opacity: 1,
      }}
    />
  )
}

// ── tiny hook: reveal on scroll ──────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ── static data ───────────────────────────────────────────────────────────────
const NAV_LINKS = ['Features', 'How it Works']

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'AI Face Detection',
    desc: 'Real-time multi-face detection with 99.9% accuracy. Instantly flags when multiple faces appear in frame.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"/><path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"/>
      </svg>
    ),
    title: 'Gaze Tracking',
    desc: 'Monitors eye movement patterns to detect off-screen activity. Configurable sensitivity per exam.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Encrypted Sessions',
    desc: 'End-to-end encrypted exam sessions. Zero data leakage. Compliant with GDPR and institutional standards.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Live Monitoring',
    desc: 'Teachers receive real-time violation alerts and live student feeds during active exam sessions.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: 'Smart AI Proctor',
    desc: 'Alice AI analyzes behavioral patterns and auto-flags suspicious activity with detailed reasoning.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Detailed Reports',
    desc: 'Post-exam violation timelines, integrity scores, and exportable PDF reports for every session.',
  },
]

const STEPS = [
  { num: '01', title: 'Create an Exam', desc: 'Set up questions, time limits, and proctoring rules in minutes using the teacher dashboard.' },
  { num: '02', title: 'Students Join', desc: 'Students enter the exam code. Camera and microphone are verified before the session begins.' },
  { num: '03', title: 'AI Monitors Live', desc: 'Alice watches in real-time. Violations are flagged, logged, and reported to the teacher instantly.' },
]

const STATS = [
  { val: '99.9%', label: 'Detection Accuracy' },
  { val: '10K+', label: 'Exams Proctored' },
  { val: '200+', label: 'Institutions' },
  { val: '<50ms', label: 'Response Time' },
]


// ── component ─────────────────────────────────────────────────────────────────
export default function GithubLandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [heroRef, heroVisible] = useReveal(0.05)
  const heroLabels = ['AI-Powered Proctoring', 'Real-time Monitoring', 'Zero Compromise Integrity', 'Behavioral Analysis']
  const [labelIndex, setLabelIndex] = useState(0)
  const [labelFade, setLabelFade] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setLabelFade(false)
      setTimeout(() => {
        setLabelIndex(i => (i + 1) % heroLabels.length)
        setLabelFade(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  const [featRef, featVisible] = useReveal()
  const [stepsRef, stepsVisible] = useReveal()
  const [statsRef, statsVisible] = useReveal()
  const [scanConf, setScanConf] = useState(0)
  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v += Math.random() * 3
      if (v >= 99.7) { v = 99.7; clearInterval(t) }
      setScanConf(parseFloat(v.toFixed(1)))
    }, 40)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <StarField />
      {/* all content above the stars */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d1117; }

        /* scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #484f58; }

        /* nav link */
        .gh-nav-link {
          color: #8b949e;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .gh-nav-link:hover { color: #e6edf3; background: #161b22; }

        /* primary button */
        .gh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #2ea043;
          color: #fff;
          border: 1px solid rgba(240,246,252,0.1);
          padding: 9px 20px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
        }
        .gh-btn:hover { background: #3fb950; box-shadow: 0 0 0 3px rgba(46,160,67,0.2); transform: translateY(-1px); }
        .gh-btn:active { transform: translateY(0); }

        /* outline button */
        .gh-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #e6edf3;
          border: 1px solid #30363d;
          padding: 9px 20px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
        }
        .gh-btn-outline:hover { background: #161b22; border-color: #8b949e; transform: translateY(-1px); }
        .gh-btn-outline:active { transform: translateY(0); }

        /* feature card */
        .gh-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 28px 24px;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .gh-card:hover { border-color: #484f58; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

        /* step card */
        .gh-step {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 32px 28px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .gh-step:hover { border-color: #2ea043; transform: translateY(-2px); }

        /* input */
        .gh-input {
          width: 100%;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #e6edf3;
          font-size: 0.875rem;
          font-family: inherit;
          padding: 9px 14px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .gh-input:focus { border-color: #2ea043; box-shadow: 0 0 0 3px rgba(46,160,67,0.15); }
        .gh-input::placeholder { color: #484f58; }

        /* code block */
        .gh-code {
          background: #000000;
          border: 1px solid #30363d;
          border-radius: 10px;
          overflow: hidden;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.82rem;
          line-height: 1.7;
        }
        .gh-code-header {
          background: #21262d;
          border-bottom: 1px solid #30363d;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gh-code-dot { width: 12px; height: 12px; border-radius: 50%; }

        /* section label */
        .gh-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(46,160,67,0.1);
          border: 1px solid rgba(46,160,67,0.3);
          color: #3fb950;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        @keyframes gh-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(63,185,80,0.5); }
          50% { box-shadow: 0 0 0 4px rgba(63,185,80,0); }
        }

        /* divider */
        .gh-divider { border: none; border-top: 1px solid #21262d; }

        /* reveal */
        .reveal { transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal-hidden { opacity: 0; transform: translateY(24px); }
        .reveal-visible { opacity: 1; transform: translateY(0); }

        /* mobile */
        @media (max-width: 768px) {
          .gh-desktop-nav { display: none !important; }
          .gh-mobile-toggle { display: flex !important; }
          .gh-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .gh-hero-image { margin-top: 20px; }
          .gh-hero-code { display: none !important; }
          .gh-feat-grid { grid-template-columns: 1fr !important; }
          .gh-steps-grid { grid-template-columns: 1fr !important; }
          .gh-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .gh-contact-grid { grid-template-columns: 1fr !important; }
          .gh-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .gh-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        background: scrolled ? 'rgba(13,17,23,0.95)' : '#0d1117',
        borderBottom: `1px solid ${scrolled ? '#21262d' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AliceLogo size={34} />
            <span style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem', letterSpacing: -0.3 }}>Alice Exam Proctor</span>
          </div>

          {/* Desktop nav */}
          <nav className="gh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={l === 'GitHub' ? 'https://github.com/adii0018' : `#${l.toLowerCase().replace(/\s+/g, '-')}`}
                target={l === 'GitHub' ? '_blank' : undefined}
                rel={l === 'GitHub' ? 'noopener noreferrer' : undefined}
                className="gh-nav-link"
              >{l}</a>
            ))}
            <Link to="/blog" className="gh-nav-link">Blog</Link>
            <Link to="/contact" className="gh-nav-link">Contact</Link>
            <Link to="/privacy" className="gh-nav-link">Privacy</Link>
          </nav>

          {/* Actions */}
          <div className="gh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/auth" className="gh-btn-outline" style={{ padding: '7px 16px' }}>Sign in</Link>
            <Link to="/auth" className="gh-btn" style={{ padding: '7px 16px' }}>Get started</Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="gh-mobile-toggle"
            style={{ display: 'none', background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 6 }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: '#161b22', borderTop: '1px solid #21262d', padding: '12px 24px 20px' }}>
            {NAV_LINKS.map(l => (
              <a
                key={l}
                href={l === 'GitHub' ? 'https://github.com/adii0018' : `#${l.toLowerCase().replace(/\s+/g, '-')}`}
                target={l === 'GitHub' ? '_blank' : undefined}
                rel={l === 'GitHub' ? 'noopener noreferrer' : undefined}
                className="gh-nav-link"
                style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d' }}
                onClick={() => setMobileOpen(false)}
              >{l}</a>
            ))}
            <Link to="/blog" className="gh-nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d' }}>Blog</Link>
            <Link to="/contact" className="gh-nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d' }}>Contact</Link>
            <Link to="/privacy" className="gh-nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d' }}>Privacy</Link>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/auth" className="gh-btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Sign in</Link>
              <Link to="/auth" className="gh-btn" style={{ flex: 1, justifyContent: 'center' }}>Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        {/* Star background with blend mode */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/star.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          zIndex: 0
        }} />
        
        <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div
          ref={heroRef}
          className="gh-hero-grid reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left */}
          <div className={`reveal ${heroVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
            <div className="gh-label" style={{ minWidth: 220 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950', display: 'inline-block', flexShrink: 0, animation: 'gh-pulse 2s infinite' }} />
              <span style={{
                opacity: labelFade ? 1 : 0,
                transform: labelFade ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                display: 'inline-block',
              }}>
                {heroLabels[labelIndex]}
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              color: '#e6edf3',
              lineHeight: 1.15,
              letterSpacing: -1,
              marginBottom: 20,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>Alice <Plane size={42} strokeWidth={2.5} color="#3fb950" /></span><br />
              <span style={{ color: '#3fb950' }}> Exam Proctor !!</span>
            </h1>
            <p style={{ color: '#8b949e', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
              Alice monitors students in real-time using computer vision and behavioral analysis — keeping every online exam honest and secure.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/auth" className="gh-btn" style={{ padding: '11px 24px', fontSize: '0.95rem' }}>
                Get started free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              <a href="#features" className="gh-btn-outline" style={{ padding: '11px 24px', fontSize: '0.95rem' }}>
                See features
              </a>
            </div>
            {/* trust bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
              {['No credit card required', 'Free for educators', 'GDPR compliant'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b949e', fontSize: '0.8rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ea043" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — AI Biometric Face Scan Orb */}
          <div className={`gh-hero-image reveal ${heroVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.15s', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            {/* Ambient glow */}
            <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(63,185,80,0.18) 0%, transparent 70%)', filter: 'blur(30px)', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

              {/* Header chip */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '6px 14px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950', display: 'inline-block', animation: 'gh-pulse 2s infinite' }} />
                  <span style={{ color: '#8b949e', fontSize: '0.7rem', fontFamily: 'monospace' }}>alice-ai / biometric-scan</span>
                </div>
                <div style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', color: '#3fb950', fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>LIVE</div>
              </div>

              {/* Main scan orb */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 420, margin: '0 auto' }}>

                {/* Rotating outer ring 1 */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dashed rgba(63,185,80,0.25)', animation: 'spin-slow 12s linear infinite' }} />
                {/* Rotating outer ring 2 */}
                <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '1px solid rgba(63,185,80,0.15)', animation: 'spin-slow 8s linear infinite reverse' }} />
                {/* Solid ring */}
                <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '2px solid #30363d' }} />

                {/* Inner scan area */}
                <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', background: '#0d1117', overflow: 'hidden' }}>

                  {/* Grid overlay */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3fb950" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Student Image */}
                  <img
                    src="/student.png"
                    alt="Student"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                      transform: 'scale(1.25)',
                      transformOrigin: 'top center',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                  />

                  {/* AI Scan Overlay — dots + brackets on top of image */}
                  <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">

                    {/* Scan brackets */}
                    <path d="M18 18 L18 38 M18 18 L38 18" stroke="#3fb950" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    <path d="M182 18 L182 38 M182 18 L162 18" stroke="#3fb950" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    <path d="M18 182 L18 162 M18 182 L38 182" stroke="#3fb950" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    <path d="M182 182 L182 162 M182 182 L162 182" stroke="#3fb950" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    {/* Face outline dashed */}
                    <ellipse cx="100" cy="85" rx="60" ry="62" fill="none" stroke="#3fb950" strokeWidth="1" strokeDasharray="4 5" opacity="0.35"/>
                  </svg>



                  {/* Animated scan line */}
                  <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #3fb950, transparent)', boxShadow: '0 0 12px 3px rgba(63,185,80,0.5)', animation: 'scan-sweep 2.4s ease-in-out infinite' }} />

                  {/* Confidence badge (center bottom) */}
                  <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3fb950', fontFamily: 'monospace', lineHeight: 1, textShadow: '0 0 20px rgba(63,185,80,0.6)' }}>{scanConf}%</div>
                    <div style={{ color: '#8b949e', fontSize: '0.6rem', marginTop: 3, letterSpacing: 2, textTransform: 'uppercase' }}>Confidence</div>
                  </div>
                </div>

                {/* Floating metric badges */}
                <div style={{ position: 'absolute', top: '18%', right: '-2%', background: '#161b22', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 8, padding: '6px 10px', animation: 'float-badge 3s ease-in-out infinite' }}>
                  <div style={{ color: '#3fb950', fontSize: '0.7rem', fontWeight: 700 }}>Face Match</div>
                  <div style={{ color: '#e6edf3', fontSize: '0.62rem', marginTop: 2 }}>✓ Verified</div>
                </div>
                <div style={{ position: 'absolute', top: '42%', left: '-4%', background: '#161b22', border: '1px solid rgba(227,179,65,0.3)', borderRadius: 8, padding: '6px 10px', animation: 'float-badge 3.5s ease-in-out 0.5s infinite' }}>
                  <div style={{ color: '#e3b341', fontSize: '0.7rem', fontWeight: 700 }}>Gaze Track</div>
                  <div style={{ color: '#e6edf3', fontSize: '0.62rem', marginTop: 2 }}>→ On-screen</div>
                </div>
                <div style={{ position: 'absolute', bottom: '14%', right: '-2%', background: '#161b22', border: '1px solid rgba(121,192,255,0.3)', borderRadius: 8, padding: '6px 10px', animation: 'float-badge 4s ease-in-out 1s infinite' }}>
                  <div style={{ color: '#79c0ff', fontSize: '0.7rem', fontWeight: 700 }}>Liveness</div>
                  <div style={{ color: '#e6edf3', fontSize: '0.62rem', marginTop: 2 }}>● Real Human</div>
                </div>
              </div>

              {/* Terminal readout */}
              <div style={{ marginTop: 16, background: '#0d1117', border: '1px solid #21262d', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace' }}>
                {[
                  { prefix: '✓', text: 'Identity verified — Aditya Singh Rajput', color: '#3fb950' },
                  { prefix: '◎', text: 'No foreign faces detected in frame', color: '#3fb950' },
                  { prefix: '👀', text: 'Gaze pattern nominal — exam ongoing', color: '#8b949e' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.65rem', padding: '3px 0', borderBottom: i < 2 ? '1px solid #21262d' : 'none', animation: `fade-in-row 0.4s ease ${i * 0.2 + 0.6}s both` }}>
                    <span style={{ color: row.color, flexShrink: 0 }}>{row.prefix}</span>
                    <span style={{ color: '#8b949e' }}>{row.text}</span>
                  </div>
                ))}
              </div>

              {/* Keyframes */}
              <style>{`
                @keyframes spin-slow { to { transform: rotate(360deg); } }
                @keyframes scan-sweep {
                  0%,100% { top: 5%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 95%; opacity: 0; }
                }
                @keyframes dot-pop {
                  from { transform: scale(0); opacity: 0; }
                  to   { transform: scale(1); opacity: 0.9; }
                }
                @keyframes float-badge {
                  0%,100% { transform: translateY(0px); }
                  50%     { transform: translateY(-6px); }
                }
                @keyframes fade-in-row {
                  from { opacity: 0; transform: translateX(-8px); }
                  to   { opacity: 1; transform: translateX(0); }
                }
              `}</style>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', padding: '48px 24px' }}>
        <div
          ref={statsRef}
          className={`gh-stats-grid reveal ${statsVisible ? 'reveal-visible' : 'reveal-hidden'}`}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              padding: '16px 24px',
              borderRight: i < STATS.length - 1 ? '1px solid #21262d' : 'none',
              transitionDelay: `${i * 0.08}s`,
            }}>
              <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -1 }}>{s.val}</div>
              <div style={{ color: '#8b949e', fontSize: '0.82rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div ref={featRef} className={`reveal ${featVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="gh-label" style={{ justifyContent: 'center' }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e2e8f0', letterSpacing: -0.5, marginBottom: 14 }}>
            Everything you need to <span style={{ color: '#2dd4bf' }}>proctor at scale</span>
          </h2>
          <p style={{ color: '#8b949e', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
            Built for educators who need reliable, AI-driven exam integrity without the complexity.
          </p>
        </div>
        <div
          className="gh-feat-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`gh-card reveal ${featVisible ? 'reveal-visible' : 'reveal-hidden'}`}
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div style={{ width: 40, height: 40, background: 'rgba(46,160,67,0.12)', border: '1px solid rgba(46,160,67,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fb950', marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ color: '#e6edf3', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#8b949e', fontSize: '0.85rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: 'transparent', borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div ref={stepsRef} className={`reveal ${stepsVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="gh-label" style={{ justifyContent: 'center' }}>How it Works</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e2e8f0', letterSpacing: -0.5 }}>
              Up and running in <span style={{ color: '#2dd4bf' }}>three steps</span>
            </h2>
          </div>
          <div className="gh-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`gh-step reveal ${stepsVisible ? 'reveal-visible' : 'reveal-hidden'}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3fb950', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Step {s.num}</div>
                <h3 style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: '#8b949e', fontSize: '0.875rem', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / README STYLE ───────────────────────────────────────────── */}
      <section id="about" style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="gh-label">About</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, marginBottom: 16, lineHeight: 1.3 }}>
              Built for integrity.<br />Designed for scale.
            </h2>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 14 }}>
              Alice is an AI-powered exam proctoring platform that monitors students in real-time using computer vision and behavioral analysis.
            </p>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 32 }}>
              From face detection to gaze tracking, every session is secured with end-to-end encryption and intelligent violation detection — giving educators confidence and students a fair environment.
            </p>
            <Link to="/auth" className="gh-btn">Start for free</Link>
          </div>

          {/* README-style box */}
          <div className="gh-code">
            <div className="gh-code-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span style={{ color: '#8b949e', fontSize: '0.78rem' }}>README.md</span>
            </div>
            <div style={{ 
              padding: '20px 24px', 
              position: 'relative',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 40a6 6 0 016-6h3a9 9 0 0117.4 3 6 6 0 011.2 10.8H30a6 6 0 010-12z' /%3E%3Cpath d='M110 120a4 4 0 014-4h2a6 6 0 0111.5 2 4 4 0 01.5 7.5h-18a4 4 0 010-8z' /%3E%3C/g%3E%3C/svg%3E")`, 
              backgroundSize: '160px 160px',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat'
            }}>
              <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem', marginBottom: 12, position: 'relative', zIndex: 1 }}>
                # Alice Exam Proctor
              </div>
              <div style={{ color: '#8b949e', fontSize: '0.82rem', lineHeight: 1.8, marginBottom: 16 }}>
                AI-powered online exam proctoring with real-time monitoring.
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['v2.0.0', 'MIT License', 'Python 3.11', 'React 18'].map(b => (
                  <span key={b} style={{ background: 'rgba(46,160,67,0.15)', border: '1px solid rgba(46,160,67,0.25)', color: '#3fb950', fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>{b}</span>
                ))}
              </div>
              <hr className="gh-divider" style={{ marginBottom: 16 }} />
              {[
                ['Face Detection', '99.9% accuracy'],
                ['Gaze Tracking', 'Real-time'],
                ['Encryption', 'End-to-end'],
                ['Uptime', '99.99%'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #21262d', fontSize: '0.82rem' }}>
                  <span style={{ color: '#8b949e' }}>{k}</span>
                  <span style={{ color: '#3fb950', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ALICE AI SHOWCASE ─────────────────────────────────────────────── */}
      <AliceAIShowcase />

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <TestimonialsSection />


      {/* ── FOOTER ── */}
      <PremiumFooter />

    </div>{/* end z-index wrapper */}
    </div>
  )
}
