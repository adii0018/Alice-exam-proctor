import { useState, useEffect, useRef } from 'react'

// ── Alice AI Chat Showcase ─────────────────────────────────────────────────────
// A live-feeling AI chat demo that auto-types responses to show off Alice AI

const CONVERSATIONS = [
  {
    user: "What happens if a student switches tabs during an exam?",
    ai: "When a student switches tabs, Alice immediately logs a **Tab Switch Violation** with a timestamp. The event is streamed to the teacher's live dashboard via WebSocket in under 50ms. If the student exceeds the configured threshold (default: 3 switches), Alice auto-flags the session as **High Risk** 🔴.",
  },
  {
    user: "How does gaze tracking work?",
    ai: "Alice uses a TensorFlow.js face-mesh model running **entirely in the browser** — no video is sent to servers. The model tracks 468 facial landmarks to calculate gaze direction. If the student's eyes deviate off-screen for more than 3 seconds, a **Gaze Deviation** flag is raised with severity proportional to duration. 👀",
  },
  {
    user: "Can Alice detect if someone else enters the room?",
    ai: "Yes! Alice runs continuous **multi-face detection** using BlazeFace. If the model detects more than one face in the camera frame, it instantly logs a **Multiple Faces Detected** violation with face count and confidence score. Teachers see this in real-time on their monitoring panel. 🛡️",
  },
  {
    user: "Is student data safe with Alice?",
    ai: "Absolutely. Alice processes webcam frames **locally in the browser** — no raw video is ever transmitted or stored. User data is encrypted with **AES-256 at rest** and **TLS 1.2+ in transit**. We're fully GDPR compliant, and violation logs are auto-purged after 90 days. 🔐",
  },
]

const AI_CAPABILITIES = [
  { icon: '👁️', label: 'Face Detection', stat: '99.9%', desc: 'accuracy' },
  { icon: '🧠', label: 'Gaze Tracking', stat: '<50ms', desc: 'latency' },
  { icon: '🔒', label: 'Privacy', stat: '100%', desc: 'on-device' },
  { icon: '⚡', label: 'Real-time', stat: '24/7', desc: 'monitoring' },
]

export default function AliceAIShowcase() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeConvo, setActiveConvo] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [pulseIdx, setPulseIdx] = useState(0)
  const chatBodyRef = useRef(null)

  // Intersection observer for reveal
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Rotate capability pulse
  useEffect(() => {
    const t = setInterval(() => setPulseIdx(i => (i + 1) % AI_CAPABILITIES.length), 2000)
    return () => clearInterval(t)
  }, [])

  // Auto-type AI response
  useEffect(() => {
    const convo = CONVERSATIONS[activeConvo]
    setDisplayedText('')
    setShowUser(false)
    setIsTyping(false)

    // Show user message first
    const t1 = setTimeout(() => setShowUser(true), 300)
    // Then start typing AI response
    const t2 = setTimeout(() => setIsTyping(true), 1200)

    let charIdx = 0
    let typeTimer
    const startTyping = setTimeout(() => {
      typeTimer = setInterval(() => {
        charIdx++
        if (charIdx <= convo.ai.length) {
          setDisplayedText(convo.ai.slice(0, charIdx))
        } else {
          clearInterval(typeTimer)
          setIsTyping(false)
        }
      }, 18)
    }, 1400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(startTyping)
      clearInterval(typeTimer)
    }
  }, [activeConvo])

  // Scroll chat to bottom on new text
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [displayedText, showUser])

  // Auto-cycle conversations
  useEffect(() => {
    const t = setInterval(() => {
      setActiveConvo(i => (i + 1) % CONVERSATIONS.length)
    }, 12000)
    return () => clearInterval(t)
  }, [])

  const convo = CONVERSATIONS[activeConvo]

  // Simple bold parser for **text**
  const renderAI = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#3fb950', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'transparent',
        borderTop: '1px solid #21262d',
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes ai-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(63,185,80,0.15), 0 0 60px rgba(63,185,80,0.05); }
          50% { box-shadow: 0 0 30px rgba(63,185,80,0.25), 0 0 80px rgba(63,185,80,0.1); }
        }
        @keyframes ai-dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes ai-border-shimmer {
          0% { border-color: rgba(63,185,80,0.15); }
          50% { border-color: rgba(63,185,80,0.35); }
          100% { border-color: rgba(63,185,80,0.15); }
        }
        @keyframes cap-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .ai-chat-window {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 16px;
          overflow: hidden;
          animation: ai-glow-pulse 4s ease-in-out infinite;
          transition: transform 0.3s;
          max-width: 560px;
          width: 100%;
        }
        .ai-chat-window:hover { transform: translateY(-4px); }
        .ai-q-btn {
          text-align: left;
          background: none;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 12px 16px;
          color: #8b949e;
          font-size: 0.82rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.5;
          width: 100%;
        }
        .ai-q-btn:hover { border-color: #3fb950; color: #e6edf3; background: rgba(46,160,67,0.04); }
        .ai-q-btn.active { border-color: #3fb950; color: #3fb950; background: rgba(46,160,67,0.08); }
        @media (max-width: 900px) {
          .ai-showcase-grid { grid-template-columns: 1fr !important; }
          .ai-questions-sidebar { display: none !important; }
        }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: -100, left: '30%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(63,185,80,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: '20%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(63,185,80,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
            color: '#3fb950', fontSize: '0.78rem', fontWeight: 600, padding: '4px 14px',
            borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950', display: 'inline-block', animation: 'ai-dot-bounce 1.4s ease-in-out infinite' }} />
            Alice AI — Live Demo
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -0.5, marginBottom: 12 }}>
            Meet <span style={{ color: '#3fb950' }}>Alice</span>, your AI proctor
          </h2>
          <p style={{ color: '#8b949e', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto' }}>
            Alice understands context, explains violations, and answers questions in real-time — all while keeping exams secure.
          </p>
        </div>

        {/* Capability pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {AI_CAPABILITIES.map((cap, i) => (
            <div key={cap.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: i === pulseIdx ? 'rgba(46,160,67,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === pulseIdx ? 'rgba(46,160,67,0.3)' : '#30363d'}`,
              borderRadius: 12, padding: '10px 18px',
              transition: 'all 0.4s ease',
              animation: i === pulseIdx ? 'cap-pulse 2s ease-in-out infinite' : 'none',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{cap.icon}</span>
              <div>
                <div style={{ color: i === pulseIdx ? '#3fb950' : '#e6edf3', fontWeight: 700, fontSize: '0.82rem' }}>{cap.label}</div>
                <div style={{ color: '#8b949e', fontSize: '0.7rem' }}>
                  <span style={{ color: i === pulseIdx ? '#3fb950' : '#e6edf3', fontWeight: 700 }}>{cap.stat}</span> {cap.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid: Questions + Chat */}
        <div className="ai-showcase-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start', justifyItems: 'center' }}>

          {/* Questions sidebar */}
          <div className="ai-questions-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: '#484f58', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Ask Alice</div>
            {CONVERSATIONS.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveConvo(i)}
                className={`ai-q-btn ${activeConvo === i ? 'active' : ''}`}
              >
                {c.user}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="ai-chat-window">
            {/* Title bar */}
            <div style={{
              background: '#161b22', borderBottom: '1px solid #21262d',
              padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(63,185,80,0.2), rgba(46,160,67,0.1))',
                  border: '1px solid rgba(63,185,80,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}>
                  <svg width="18" height="18" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
                    <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
                    <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                    <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: '0.82rem' }}>Alice AI</div>
                  <div style={{ color: '#3fb950', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
                    Online — thinking at light speed
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f85149', opacity: 0.7 }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e3b341', opacity: 0.7 }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3fb950', opacity: 0.7 }} />
              </div>
            </div>

            {/* Chat body */}
            <div ref={chatBodyRef} style={{
              padding: '20px 18px', minHeight: 320, maxHeight: 380, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 16,
              background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)',
            }}>
              {/* User message */}
              {showUser && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.2)',
                    borderRadius: '14px 14px 4px 14px', padding: '12px 16px',
                    maxWidth: '85%', color: '#e6edf3', fontSize: '0.85rem', lineHeight: 1.6,
                    animation: 'fadeSlideUp 0.3s ease',
                  }}>
                    {convo.user}
                  </div>
                </div>
              )}

              {/* AI response */}
              {(isTyping || displayedText) && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #2ea043, #3fb950)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', marginTop: 2,
                    animation: 'ai-border-shimmer 2s ease-in-out infinite',
                    border: '1px solid rgba(63,185,80,0.3)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#fff" opacity="0.95"/>
                      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#fff" opacity="0.6"/>
                      <line x1="50" y1="22" x2="50" y2="78" stroke="#2ea043" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                    </svg>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid #21262d',
                    borderRadius: '4px 14px 14px 14px', padding: '12px 16px',
                    maxWidth: '85%', color: '#c9d1d9', fontSize: '0.85rem', lineHeight: 1.75,
                  }}>
                    {displayedText ? renderAI(displayedText) : null}
                    {isTyping && (
                      <span style={{ display: 'inline-flex', gap: 3, marginLeft: 4, verticalAlign: 'middle' }}>
                        {[0, 1, 2].map(d => (
                          <span key={d} style={{
                            width: 4, height: 4, borderRadius: '50%', background: '#3fb950',
                            display: 'inline-block',
                            animation: `ai-dot-bounce 1.2s ease-in-out ${d * 0.15}s infinite`,
                          }} />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom bar */}
            <div style={{
              borderTop: '1px solid #21262d', padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#161b22',
            }}>
              <div style={{
                flex: 1, background: '#0d1117', border: '1px solid #30363d',
                borderRadius: 10, padding: '9px 14px', color: '#484f58', fontSize: '0.8rem',
              }}>
                Ask Alice anything about proctoring...
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#3fb950', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Powered by footer */}
        <div style={{ textAlign: 'center', marginTop: 40, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['TensorFlow.js', 'BlazeFace', 'FaceMesh', 'WebSocket', 'On-Device AI'].map(t => (
            <span key={t} style={{
              color: '#484f58', fontSize: '0.72rem', fontWeight: 500,
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.02)', border: '1px solid #21262d',
            }}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
