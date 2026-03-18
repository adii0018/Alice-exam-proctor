import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PremiumFooterEnhanced from '../components/common/PremiumFooterEnhanced'

// Matrix rain canvas
function MatrixRain() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const cols = Math.floor(canvas.width / 20)
    const drops = Array(cols).fill(1)
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let animId
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff9f'
      ctx.font = '14px monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y * 20)
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.18, pointerEvents: 'none' }} />
}

// Typing animation hook
function useTyping(texts, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [textIdx, setTextIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = texts[textIdx]
    let timeout
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setTextIdx(i => (i + 1) % texts.length)
    }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, textIdx, texts, speed, pause])
  return display
}

// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

const features = [
  { icon: '🛡️', title: 'AI Face Detection', desc: 'Real-time multi-face detection with 99.9% accuracy. Flags anomalies instantly.' },
  { icon: '👁️', title: 'Gaze Tracking', desc: 'Monitors eye movement patterns to detect off-screen activity during exams.' },
  { icon: '🔒', title: 'Secure Sessions', desc: 'End-to-end encrypted exam sessions. Zero data leakage guaranteed.' },
  { icon: '⚡', title: 'Live Monitoring', desc: 'Teachers get real-time violation alerts and live student feeds.' },
  { icon: '🧠', title: 'Smart AI Proctor', desc: 'Alice AI analyzes behavior patterns and auto-flags suspicious activity.' },
  { icon: '📊', title: 'Detailed Reports', desc: 'Post-exam violation timelines, scores, and integrity reports.' },
]

const terminalLines = [
  '> Initializing Alice Proctor v2.0...',
  '> Loading AI models... [OK]',
  '> Face detection module... [ACTIVE]',
  '> Gaze tracking engine... [ACTIVE]',
  '> WebSocket server... [CONNECTED]',
  '> Encryption layer... [ENABLED]',
  '> System ready. All modules operational.',
]

function FeatureCard({ feature, idx }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`,
        background: 'rgba(0,255,159,0.03)',
        border: '1px solid rgba(0,255,159,0.25)',
        borderRadius: '12px',
        padding: '28px 24px',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="hacker-card"
    >
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{feature.icon}</div>
      <h3 style={{ color: '#00ff9f', fontFamily: 'monospace', fontSize: '1rem', marginBottom: '10px', textShadow: '0 0 8px #00ff9f88' }}>
        {feature.title}
      </h3>
      <p style={{ color: '#ffffffaa', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}>{feature.desc}</p>
    </div>
  )
}

function TerminalBox() {
  const [lines, setLines] = useState([])
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #00ff9f44',
      borderRadius: '10px',
      padding: '20px 24px',
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      boxShadow: '0 0 30px #00ff9f22',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        <span style={{ marginLeft: 8, color: '#ffffff55', fontSize: '0.75rem' }}>alice-proctor — bash</span>
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{ color: i === lines.length - 1 ? '#00ff9f' : '#00ff9faa', marginBottom: '4px', textShadow: '0 0 6px #00ff9f66' }}>
          {line}
        </div>
      ))}
      {lines.length < terminalLines.length && (
        <span style={{ color: '#00ff9f', animation: 'blink 1s step-end infinite' }}>█</span>
      )}
    </div>
  )
}

const PremiumLandingPage = () => {
  const typedText = useTyping([
    'Initializing System...',
    'AI Proctor Online.',
    'Zero Cheating. Zero Compromise.',
    'Welcome to Alice.',
  ])
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [menuOpen, setMenuOpen] = useState(false)

  const [heroRef, heroVisible] = useScrollReveal()
  const [aboutRef, aboutVisible] = useScrollReveal()
  const [featRef, featVisible] = useScrollReveal()
  const [contactRef, contactVisible] = useScrollReveal()

  const handleContactChange = (e) => setContactForm({ ...contactForm, [e.target.name]: e.target.value })

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: '', message: '' })
    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message })
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message' })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#ffffff', fontFamily: 'monospace', overflowX: 'hidden' }}>
      <MatrixRain />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000; overflow-x: hidden; }

        /* Smooth section transitions */
        section { will-change: transform; }

        /* Hacker card */
        .hacker-card {
          transition: border-color 0.35s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.35s cubic-bezier(0.4,0,0.2,1),
                      transform 0.35s cubic-bezier(0.4,0,0.2,1) !important;
        }
        .hacker-card:hover {
          border-color: rgba(0,255,159,0.7) !important;
          box-shadow: 0 0 28px rgba(0,255,159,0.2), inset 0 0 24px rgba(0,255,159,0.04) !important;
          transform: translateY(-6px) !important;
        }

        /* Buttons */
        .neon-btn {
          background: transparent;
          border: 1.5px solid #00ff9f;
          color: #00ff9f;
          padding: 12px 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          border-radius: 6px;
          cursor: pointer;
          text-shadow: 0 0 8px rgba(0,255,159,0.6);
          box-shadow: 0 0 12px rgba(0,255,159,0.2);
          transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1);
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .neon-btn:hover {
          background: rgba(0,255,159,0.08);
          box-shadow: 0 0 32px rgba(0,255,159,0.5), 0 0 64px rgba(0,255,159,0.15);
          transform: translateY(-2px) scale(1.03);
        }
        .neon-btn:active { transform: scale(0.97); }

        .neon-btn-solid {
          background: #00ff9f;
          border: 1.5px solid #00ff9f;
          color: #000;
          padding: 12px 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          box-shadow: 0 0 24px rgba(0,255,159,0.4);
          transition: box-shadow 0.3s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.2s;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .neon-btn-solid:hover {
          background: #00ffb3;
          box-shadow: 0 0 48px rgba(0,255,159,0.7), 0 0 96px rgba(0,255,159,0.2);
          transform: translateY(-2px) scale(1.03);
        }
        .neon-btn-solid:active { transform: scale(0.97); }

        /* Animations */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes glitch {
          0%,85%,100% { text-shadow: 0 0 20px #00ff9f, 0 0 40px rgba(0,255,159,0.5); clip-path: none; }
          86% { text-shadow: -3px 0 #ff0040, 3px 0 #00ff9f; clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
          88% { text-shadow: 3px 0 #ff0040, -3px 0 #00ff9f; clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
          90% { text-shadow: 0 0 20px #00ff9f, 0 0 40px rgba(0,255,159,0.5); clip-path: none; }
        }
        .glitch-text { animation: glitch 4s ease-in-out infinite; }

        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes float-up { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* Nav links */
        .nav-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          padding: 7px 14px;
          border-radius: 5px;
          transition: color 0.2s ease, text-shadow 0.2s ease, background 0.2s ease;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 14px; right: 14px;
          height: 1px;
          background: #00ff9f;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 0 6px #00ff9f;
        }
        .nav-link:hover { color: #00ff9f; text-shadow: 0 0 10px rgba(0,255,159,0.5); }
        .nav-link:hover::after { transform: scaleX(1); }

        /* Inputs */
        input:not(.footer-subscribe-input), textarea {
          background: rgba(0,255,159,0.03) !important;
          border: 1px solid rgba(0,255,159,0.2) !important;
          color: #fff !important;
          font-family: 'JetBrains Mono', monospace !important;
          border-radius: 6px !important;
          padding: 12px 16px !important;
          width: 100% !important;
          outline: none !important;
          transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
          font-size: 0.88rem !important;
        }
        input:not(.footer-subscribe-input):focus, textarea:focus {
          border-color: rgba(0,255,159,0.6) !important;
          box-shadow: 0 0 16px rgba(0,255,159,0.12) !important;
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25) !important; }
        textarea { resize: vertical; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,159,0.3); border-radius: 3px; transition: background 0.3s; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,159,0.6); }

        /* Section label */
        .section-label {
          color: rgba(0,255,159,0.5);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 4px;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        /* Stat card hover */
        .stat-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .stat-card:hover {
          border-color: rgba(0,255,159,0.5) !important;
          box-shadow: 0 0 20px rgba(0,255,159,0.12) !important;
          transform: translateY(-3px);
        }

        /* Step card */
        .step-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .step-card:hover {
          border-color: rgba(0,255,159,0.4) !important;
          box-shadow: 0 0 24px rgba(0,255,159,0.1) !important;
          transform: translateY(-4px);
        }

        /* Mobile nav */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-cta { display: flex !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        borderBottom: '1px solid rgba(0,255,159,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0 5%',
        transition: 'background 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#00ff9f', fontSize: '1.4rem', fontWeight: 700, textShadow: '0 0 14px rgba(0,255,159,0.7)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
              {'>'} Alice
            </span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: 2 }}>EXAM_PROCTOR</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[['#about','about'],['#features','features'],['#terminal','terminal'],['#contact','contact']].map(([href, label], i) => (
              <a key={i} href={href} className="nav-link">{label}</a>
            ))}
            <Link to="/auth" className="neon-btn" style={{ padding: '8px 22px', marginLeft: 16, fontSize: '0.82rem' }}>
              Login
            </Link>
            <Link to="/auth" className="neon-btn-solid" style={{ padding: '8px 22px', fontSize: '0.82rem' }}>
              Get Started
            </Link>
          </div>
          {/* Mobile CTA */}
          <div className="mobile-cta" style={{ display: 'none', gap: 8 }}>
            <Link to="/auth" className="neon-btn-solid" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>Enter</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,159,0.2), transparent)' }} />
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5% 80px', position: 'relative', zIndex: 1 }}>
        {/* subtle radial glow behind hero */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(0,255,159,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div ref={heroRef} style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(50px)', transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1)', maxWidth: 800, width: '100%' }}>
          <div style={{ color: 'rgba(0,255,159,0.5)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', marginBottom: 24, letterSpacing: 5, textTransform: 'uppercase' }}>
            // system online — ai proctoring active
          </div>
          <h1 className="glitch-text" style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 700,
            color: '#00ff9f',
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.1,
            marginBottom: 20,
            textShadow: '0 0 24px rgba(0,255,159,0.6), 0 0 48px rgba(0,255,159,0.2)',
            letterSpacing: -1,
          }}>
            Alice Exam Proctor
          </h1>
          <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#00ff9f', fontFamily: "'JetBrains Mono', monospace", minHeight: '2em', marginBottom: 16, opacity: 0.85 }}>
            <span>{typedText}</span>
            <span style={{ animation: 'blink 1s step-end infinite', color: '#00ff9f' }}>█</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', maxWidth: 520, margin: '0 auto 52px', lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
            AI-powered online exam proctoring. Real-time face detection, gaze tracking, and violation monitoring — keeping every exam fair.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="neon-btn-solid">Launch System →</Link>
            <a href="#features" className="neon-btn">Explore Features</a>
          </div>
          <div style={{ marginTop: 72, display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['99.9%', 'Detection Rate'], ['10K+', 'Exams Proctored'], ['<50ms', 'Response Time']].map(([val, label], i) => (
              <div key={label} style={{ textAlign: 'center', animation: `float-up ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
                <div style={{ color: '#00ff9f', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, textShadow: '0 0 14px rgba(0,255,159,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 6, letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '110px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div ref={aboutRef} style={{ opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? 'translateX(0)' : 'translateX(-50px)', transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="section-label">// about</div>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: 20, lineHeight: 1.2 }}>
              Built for <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Integrity.</span>
              <br />Designed for <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Scale.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 14 }}>
              Alice is an AI-powered exam proctoring platform that monitors students in real-time using computer vision and behavioral analysis.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 36 }}>
              From face detection to gaze tracking, every exam session is secured with military-grade encryption and intelligent violation detection.
            </p>
            <Link to="/auth" className="neon-btn">Access System →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Students Monitored', val: '10,000+' },
              { label: 'Violations Detected', val: '50,000+' },
              { label: 'Institutions', val: '200+' },
              { label: 'Uptime', val: '99.99%' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{
                background: 'rgba(0,255,159,0.03)',
                border: '1px solid rgba(0,255,159,0.15)',
                borderRadius: 10,
                padding: '28px 20px',
                textAlign: 'center',
                opacity: aboutVisible ? 1 : 0,
                transform: aboutVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.7s ease ${0.2 + i * 0.1}s, transform 0.7s ease ${0.2 + i * 0.1}s`,
              }}>
                <div style={{ color: '#00ff9f', fontSize: '1.9rem', fontWeight: 700, textShadow: '0 0 12px rgba(0,255,159,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 8, letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '110px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={featRef} style={{ textAlign: 'center', marginBottom: 64, opacity: featVisible ? 1 : 0, transform: featVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="section-label">// features</div>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              System <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Capabilities</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {features.map((f, i) => <FeatureCard key={i} feature={f} idx={i} />)}
          </div>
        </div>
      </section>

      {/* TERMINAL SECTION */}
      <section id="terminal" style={{ padding: '110px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label">// system_boot</div>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: 52 }}>
            Watch It <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Boot Up</span>
          </h2>
          <TerminalBox />
          <div style={{ marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="neon-btn-solid">Start Your Session →</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '110px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">// how_it_works</div>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              Three <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Steps</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { step: '01', title: 'Create Exam', desc: 'Teachers set up exams with questions, time limits, and proctoring rules in minutes.' },
              { step: '02', title: 'Students Join', desc: 'Students enter the exam code. Camera and mic are verified before the session starts.' },
              { step: '03', title: 'AI Monitors', desc: 'Alice AI watches in real-time. Violations are flagged, logged, and reported instantly.' },
            ].map((s, i) => (
              <div key={i} className="step-card" style={{
                background: 'rgba(0,255,159,0.02)',
                border: '1px solid rgba(0,255,159,0.12)',
                borderRadius: 12,
                padding: '36px 28px',
                position: 'relative',
              }}>
                <div style={{ color: '#00ff9f', fontSize: '3.5rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", opacity: 0.08, position: 'absolute', top: 12, right: 20, lineHeight: 1 }}>{s.step}</div>
                <div style={{ color: 'rgba(0,255,159,0.5)', fontFamily: 'monospace', fontSize: '0.72rem', marginBottom: 12, letterSpacing: 3 }}>STEP_{s.step}</div>
                <h3 style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.05rem', marginBottom: 14, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', fontSize: '0.83rem', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '110px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div ref={contactRef} style={{ textAlign: 'center', marginBottom: 52, opacity: contactVisible ? 1 : 0, transform: contactVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="section-label">// contact</div>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              Send a <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Transmission</span>
            </h2>
          </div>
          <div style={{ background: 'rgba(0,255,159,0.02)', border: '1px solid rgba(0,255,159,0.18)', borderRadius: 14, padding: '44px 40px', boxShadow: '0 0 60px rgba(0,255,159,0.04)' }}>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
                <div>
                  <label style={{ color: 'rgba(0,255,159,0.5)', fontFamily: 'monospace', fontSize: '0.7rem', display: 'block', marginBottom: 8, letterSpacing: 2 }}>NAME_</label>
                  <input name="name" value={contactForm.name} onChange={handleContactChange} placeholder="Your name" required />
                </div>
                <div>
                  <label style={{ color: 'rgba(0,255,159,0.5)', fontFamily: 'monospace', fontSize: '0.7rem', display: 'block', marginBottom: 8, letterSpacing: 2 }}>EMAIL_</label>
                  <input name="email" type="email" value={contactForm.email} onChange={handleContactChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label style={{ color: 'rgba(0,255,159,0.5)', fontFamily: 'monospace', fontSize: '0.7rem', display: 'block', marginBottom: 8, letterSpacing: 2 }}>SUBJECT_</label>
                <input name="subject" value={contactForm.subject} onChange={handleContactChange} placeholder="Subject" required />
              </div>
              <div>
                <label style={{ color: 'rgba(0,255,159,0.5)', fontFamily: 'monospace', fontSize: '0.7rem', display: 'block', marginBottom: 8, letterSpacing: 2 }}>MESSAGE_</label>
                <textarea name="message" value={contactForm.message} onChange={handleContactChange} placeholder="Your message..." rows={5} required />
              </div>
              {submitStatus.message && (
                <div style={{ color: submitStatus.type === 'success' ? '#00ff9f' : '#ff5555', fontFamily: 'monospace', fontSize: '0.82rem', padding: '12px 16px', border: `1px solid ${submitStatus.type === 'success' ? 'rgba(0,255,159,0.3)' : 'rgba(255,85,85,0.3)'}`, borderRadius: 6, background: submitStatus.type === 'success' ? 'rgba(0,255,159,0.05)' : 'rgba(255,85,85,0.05)' }}>
                  {submitStatus.type === 'success' ? '✓ ' : '✗ '}{submitStatus.message}
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="neon-btn-solid" style={{ marginTop: 6, opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer', width: '100%', textAlign: 'center' }}>
                {isSubmitting ? 'Transmitting...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '80px 5% 100px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', background: 'rgba(0,255,159,0.03)', border: '1px solid rgba(0,255,159,0.2)', borderRadius: 16, padding: '64px 40px', boxShadow: '0 0 80px rgba(0,255,159,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(0,255,159,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-label">// ready_to_deploy</div>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
            Start Proctoring <span style={{ color: '#00ff9f', textShadow: '0 0 14px rgba(0,255,159,0.5)' }}>Today</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', marginBottom: 40, lineHeight: 1.8 }}>
            Join thousands of institutions running fair, AI-monitored exams with Alice.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="neon-btn-solid">Get Started Free →</Link>
            <a href="#contact" className="neon-btn">Contact Us</a>
          </div>
        </div>
      </section>

      {/* FOOTER — unchanged */}
      <PremiumFooterEnhanced darkMode={true} />
    </div>
  )
}

export default PremiumLandingPage
