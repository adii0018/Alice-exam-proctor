import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import TestimonialsSection from '../components/common/TestimonialsSection'
import PremiumFooter from '../components/common/PremiumFooter'

// ── Typing Animation Hook ────────────────────────────────────────────────────
function useTypingEffect(text, speed = 100) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return { displayText, isComplete }
}

// ── Counter Animation Hook ───────────────────────────────────────────────────
function useCountUp(end, duration = 2000, isVisible = false) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!isVisible || hasStarted) return
    
    setHasStarted(true)
    const startTime = Date.now()
    const endValue = typeof end === 'string' ? parseFloat(end) : end

    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = easeOutQuart * endValue

      setCount(current)

      if (progress === 1) {
        clearInterval(timer)
        setCount(endValue)
      }
    }, 16) // ~60fps

    return () => clearInterval(timer)
  }, [end, duration, isVisible, hasStarted])

  return count
}

// ── Stat Counter Component ──────────────────────────────────────────────────
function StatCounter({ stat, index, isVisible }) {
  const count = useCountUp(parseFloat(stat.val), 2000, isVisible)
  const displayValue = stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.floor(count)
  
  return (
    <div style={{
      textAlign: 'center',
      padding: '16px 24px',
      borderRight: index < 3 ? '1px solid #21262d' : 'none',
      transitionDelay: `${index * 0.08}s`,
    }}>
      <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -1 }}>
        {stat.prefix || ''}{displayValue}{stat.suffix || ''}
      </div>
      <div style={{ color: '#8b949e', fontSize: '0.82rem', marginTop: 4 }}>{stat.label}</div>
    </div>
  )
}

// ── Animated Ticker Component ────────────────────────────────────────────────
function AnimatedTicker() {
  const features = [
    { icon: '🎯', text: 'Real-time Face Detection' },
    { icon: '👁️', text: 'Advanced Gaze Tracking' },
    { icon: '🔒', text: 'End-to-End Encryption' },
    { icon: '⚡', text: 'Lightning Fast Response' },
    { icon: '🤖', text: 'AI-Powered Analysis' },
    { icon: '📊', text: 'Detailed Reports' },
    { icon: '🌐', text: 'Multi-Platform Support' },
    { icon: '✅', text: 'GDPR Compliant' },
  ]

  return (
    <div style={{ 
      borderTop: '1px solid #21262d', 
      borderBottom: '1px solid #21262d', 
      padding: '32px 0',
      overflow: 'hidden',
      background: 'linear-gradient(90deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
      position: 'relative'
    }}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-content {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }
        .ticker-content:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: 40, 
          height: 2, 
          background: 'linear-gradient(90deg, transparent, #3fb950, transparent)' 
        }} />
        <span style={{ 
          color: '#8b949e', 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          letterSpacing: 2,
          textTransform: 'uppercase'
        }}>
          Powered by Advanced AI Technology
        </span>
        <div style={{ 
          width: 40, 
          height: 2, 
          background: 'linear-gradient(90deg, transparent, #3fb950, transparent)' 
        }} />
      </div>

      <div className="ticker-content">
        {/* Duplicate the array twice for seamless loop */}
        {[...features, ...features].map((feature, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 28px',
              background: 'rgba(22, 27, 34, 0.6)',
              border: '1px solid #30363d',
              borderRadius: 8,
              marginRight: 16,
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(46, 160, 67, 0.1)'
              e.currentTarget.style.borderColor = '#3fb950'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(22, 27, 34, 0.6)'
              e.currentTarget.style.borderColor = '#30363d'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{feature.icon}</span>
            <span style={{ 
              color: '#e6edf3', 
              fontSize: '0.875rem', 
              fontWeight: 500 
            }}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Trusted By Section ───────────────────────────────────────────────────────
function TrustedBySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [ref, visible] = useReveal(0.15)
  
  const badges = [
    { label: '99.9%', sublabel: 'Uptime', color: '#3fb950' },
    { label: '50K+', sublabel: 'Active Users', color: '#58a6ff' },
    { label: '500+', sublabel: 'Institutions', color: '#f778ba' },
    { label: '<25ms', sublabel: 'Response Time', color: '#ffa657' },
  ]

  return (
    <section 
      ref={ref}
      style={{ 
        padding: '60px 24px',
        background: 'rgba(22, 27, 34, 0.4)',
        borderTop: '1px solid #21262d',
        borderBottom: '1px solid #21262d',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div 
          className={`reveal ${visible ? 'reveal-visible' : 'reveal-hidden'}`}
          style={{ marginBottom: 48 }}
        >
          {/* Decorative line with icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20
          }}>
            <div style={{ 
              width: 60, 
              height: 1, 
              background: 'linear-gradient(90deg, transparent, #3fb950)' 
            }} />
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3fb950, #2ea043)',
              boxShadow: '0 0 20px rgba(63, 185, 80, 0.5)',
              animation: 'gh-pulse 2s infinite'
            }} />
            <div style={{ 
              width: 60, 
              height: 1, 
              background: 'linear-gradient(90deg, #3fb950, transparent)' 
            }} />
          </div>

          {/* Main heading */}
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #e6edf3 0%, #8b949e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: -1,
            marginBottom: 12,
            lineHeight: 1.2
          }}>
            Trusted by educators
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              worldwide
            </span>
          </h2>

          {/* Subtitle */}
          <p style={{
            color: '#8b949e',
            fontSize: '1rem',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Join thousands of institutions using Alice for secure, AI-powered exam proctoring
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 20,
          maxWidth: 900,
          margin: '0 auto'
        }}>
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`reveal ${visible ? 'reveal-visible' : 'reveal-hidden'}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: hoveredIndex === i 
                  ? `linear-gradient(135deg, ${badge.color}15 0%, ${badge.color}05 100%)`
                  : 'rgba(22, 27, 34, 0.4)',
                border: `1px solid ${hoveredIndex === i ? badge.color + '40' : '#30363d'}`,
                borderRadius: 12,
                padding: '28px 20px',
                transition: 'all 0.3s ease',
                transform: hoveredIndex === i ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredIndex === i 
                  ? `0 8px 24px ${badge.color}20, 0 0 0 1px ${badge.color}30`
                  : '0 2px 8px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ 
                fontSize: '2.2rem', 
                fontWeight: 800, 
                color: hoveredIndex === i ? badge.color : '#e6edf3',
                marginBottom: 8,
                transition: 'color 0.3s ease',
                letterSpacing: -1
              }}>
                {badge.label}
              </div>
              <div style={{ 
                color: '#8b949e', 
                fontSize: '0.85rem',
                fontWeight: 500
              }}>
                {badge.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
const NAV_LINKS = ['Features', 'How it Works', 'GitHub', 'Contact']

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
  { val: '99.9', label: 'Detection Accuracy', suffix: '%', decimals: 1 },
  { val: '10', label: 'Exams Proctored', suffix: 'K+', decimals: 0 },
  { val: '200', label: 'Institutions', suffix: '+', decimals: 0 },
  { val: '50', label: 'Response Time', prefix: '<', suffix: 'ms', decimals: 0 },
]

const CODE_SNIPPET = `// Alice Proctor — violation event
{
  "event": "face_not_detected",
  "student_id": "stu_8821",
  "exam_id": "exam_cs301",
  "timestamp": "2026-03-18T10:42:07Z",
  "severity": "high",
  "action": "flagged_for_review"
}`

// ── component ─────────────────────────────────────────────────────────────────
export default function GithubLandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const [heroRef, heroVisible] = useReveal(0.05)
  const heroLabels = ['AI-Powered Proctoring', 'Real-time Monitoring', 'Zero Compromise Integrity', 'Behavioral Analysis']
  const [labelIndex, setLabelIndex] = useState(0)
  const [labelFade, setLabelFade] = useState(true)
  
  // Typing animation for main title
  const { displayText: typedText, isComplete } = useTypingEffect('Exam Proctor !!', 120)
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
  const [contactRef, contactVisible] = useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleContact = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json()
      setSubmitStatus(data.success ? { ok: true, msg: data.message } : { ok: false, msg: data.error || 'Failed to send.' })
      if (data.success) setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setSubmitStatus({ ok: false, msg: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 25%, #161b22 75%, #0d1117 100%)', 
      minHeight: '100vh', 
      color: '#e6edf3', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif', 
      overflowX: 'hidden', 
      position: 'relative' 
    }}>
      <StarField />
      {/* all content above the stars */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@700&family=Satisfy&family=Great+Vibes&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d1117; }

        /* blinking cursor animation */
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

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
          background: #161b22;
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
        .reveal { transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal-hidden { opacity: 0; transform: translateY(40px) scale(0.95); }
        .reveal-visible { opacity: 1; transform: translateY(0) scale(1); }

        /* mobile */
        @media (max-width: 768px) {
          .gh-desktop-nav { display: none !important; }
          .gh-mobile-toggle { display: flex !important; }
          .gh-hero-grid { grid-template-columns: 1fr !important; }
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
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(13,17,23,0.95)' : '#0d1117',
        borderBottom: `1px solid ${scrolled ? '#21262d' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AliceLogo size={34} />
            <span style={{ color: '#e6edf3', fontWeight: 400, fontSize: '1rem', letterSpacing: 0 }}>Alice Exam Proctor</span>
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
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/auth" className="gh-btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Sign in</Link>
              <Link to="/auth" className="gh-btn" style={{ flex: 1, justifyContent: 'center' }}>Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1280, margin: '0 auto' }}>
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
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 700,
              color: '#e6edf3',
              lineHeight: 1.3,
              letterSpacing: 0,
              marginBottom: 20,
              fontFamily: "'Pacifico', cursive",
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #e6edf3 0%, #c9d1d9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Alice 🌿
              </span>
              <br />
              <span style={{ 
                color: '#3fb950',
                background: 'linear-gradient(135deg, #3fb950 0%, #2ea043 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(63, 185, 80, 0.3)',
              }}>
                {typedText}
                {!isComplete && (
                  <span style={{
                    display: 'inline-block',
                    width: '4px',
                    height: '1em',
                    background: 'linear-gradient(180deg, #3fb950 0%, #2ea043 100%)',
                    marginLeft: '6px',
                    animation: 'blink 1s infinite',
                    verticalAlign: 'middle',
                    boxShadow: '0 0 10px rgba(63, 185, 80, 0.5)',
                  }} />
                )}
              </span>
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

          {/* Right — code block */}
          <div className={`gh-hero-code gh-code reveal ${heroVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '0.15s' }}>
            <div className="gh-code-header">
              <div className="gh-code-dot" style={{ background: '#ff5f57' }} />
              <div className="gh-code-dot" style={{ background: '#febc2e' }} />
              <div className="gh-code-dot" style={{ background: '#28c840' }} />
              <span style={{ color: '#8b949e', fontSize: '0.78rem', marginLeft: 8 }}>violation-event.json</span>
            </div>
            <pre style={{ padding: '20px 24px', overflowX: 'auto', color: '#e6edf3' }}>
              <code>{CODE_SNIPPET.split('\n').map((line, i) => {
                const keyMatch = line.match(/^(\s*)"([^"]+)"(\s*:\s*)(.*)$/)
                if (keyMatch) return (
                  <span key={i} style={{ display: 'block' }}>
                    <span style={{ color: '#8b949e' }}>{keyMatch[1]}</span>
                    <span style={{ color: '#79c0ff' }}>"{keyMatch[2]}"</span>
                    <span style={{ color: '#8b949e' }}>{keyMatch[3]}</span>
                    <span style={{ color: '#a5d6ff' }}>{keyMatch[4]}</span>
                  </span>
                )
                return <span key={i} style={{ display: 'block', color: '#8b949e' }}>{line}</span>
              })}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────────────── */}
      <TrustedBySection />

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div ref={featRef} className={`reveal ${featVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="gh-label" style={{ justifyContent: 'center' }}>Features</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, marginBottom: 14 }}>
            Everything you need to proctor at scale
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
      <section id="how-it-works" style={{ background: 'rgba(22, 27, 34, 0.3)', borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div ref={stepsRef} className={`reveal ${stepsVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="gh-label" style={{ justifyContent: 'center' }}>How it Works</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5 }}>
              Up and running in three steps
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
            <div style={{ padding: '20px 24px' }}>
              <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>
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

      {/* ── CONTACT ────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: 'rgba(22, 27, 34, 0.3)', borderTop: '1px solid #21262d', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div ref={contactRef} className={`reveal ${contactVisible ? 'reveal-visible' : 'reveal-hidden'}`} style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="gh-label" style={{ justifyContent: 'center' }}>Contact</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, marginBottom: 12 }}>
              Get in touch
            </h2>
            <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Have a question or want to get started? Send us a message.</p>
          </div>
          <div
            className="gh-contact-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 900, margin: '0 auto' }}
          >
            {/* Info */}
            <div>
              <h3 style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Contact information</h3>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', val: 'singhrajputaditya982@gmail.com' },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>, label: 'GitHub', val: 'github.com/adii0018' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3fb950', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: '#8b949e', fontSize: '0.75rem', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: '#e6edf3', fontSize: '0.875rem' }}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 32, padding: '20px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8 }}>
                <div style={{ color: '#3fb950', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>Response time</div>
                <div style={{ color: '#e6edf3', fontSize: '0.875rem' }}>We typically respond within 24 hours on business days.</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>Name</label>
                  <input className="gh-input" name="name" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>Email</label>
                  <input className="gh-input" name="email" type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>Subject</label>
                <input className="gh-input" name="subject" value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" required />
              </div>
              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>Message</label>
                <textarea className="gh-input" name="message" value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us more..." rows={5} required style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              {submitStatus && (
                <div style={{ padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', background: submitStatus.ok ? 'rgba(46,160,67,0.1)' : 'rgba(248,81,73,0.1)', border: `1px solid ${submitStatus.ok ? 'rgba(46,160,67,0.3)' : 'rgba(248,81,73,0.3)'}`, color: submitStatus.ok ? '#3fb950' : '#f85149' }}>
                  {submitStatus.ok ? '✓ ' : '✗ '}{submitStatus.msg}
                </div>
              )}
              <button type="submit" disabled={submitting} className="gh-btn" style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer', justifyContent: 'center' }}>
                {submitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <TestimonialsSection />


      {/* ── FOOTER ── */}
      <PremiumFooter />

    </div>{/* end z-index wrapper */}
    </div>
  )
}
