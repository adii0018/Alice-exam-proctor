import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa'

// Alice leaf logo — GitHub dark theme
function AliceLogo({ size = 28 }) {
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

const AliceAIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Alice, your AI proctoring assistant.\nHow can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState(localStorage.getItem('aliceUserName') || '')
  const [showNamePrompt, setShowNamePrompt] = useState(!userName)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (userName.trim()) {
      localStorage.setItem('aliceUserName', userName)
      setShowNamePrompt(false)
      setMessages([
        ...messages,
        { role: 'assistant', content: `Hey ${userName}! Great to meet you.\nI'm ready to help. What's on your mind?` }
      ])
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await axios.post(`${apiBase}/ai/chat/`, {
        message: input,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'AI service is currently unavailable.\nAdd GEMINI_API_KEY to django_backend/.env to enable full responses.'
      }])
    } finally {
      setLoading(false)
    }
  }

  // GitHub dark theme palette
  const C = {
    bg:       '#0d1117',
    surface:  '#161b22',
    surface2: '#21262d',
    border:   '#30363d',
    border2:  '#484f58',
    text:     '#e6edf3',
    muted:    '#8b949e',
    green:    '#3fb950',
    greenDim: '#2ea043',
    greenBg:  'rgba(46,160,67,0.12)',
    greenBorder: 'rgba(63,185,80,0.4)',
  }

  const containerStyle = {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '380px',
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    boxShadow: '0 16px 48px rgba(1,4,9,0.8), 0 0 0 1px rgba(63,185,80,0.08)',
    zIndex: 50,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
    overflow: 'hidden',
  }

  const headerStyle = {
    background: C.surface,
    borderBottom: `1px solid ${C.border}`,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  if (showNamePrompt) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AliceLogo size={26} />
            <div>
              <span style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600 }}>Alice AI</span>
              <div style={{ color: C.muted, fontSize: '0.68rem', marginTop: 1 }}>Proctoring Assistant</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <p style={{ color: C.muted, fontSize: '0.78rem', marginBottom: 18, lineHeight: 1.5 }}>
            Before we start, what should I call you?
          </p>
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ color: C.muted, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 500 }}>
                <FaUser style={{ fontSize: '0.7rem' }} /> Your name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                style={{
                  width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: '9px 12px', color: C.text,
                  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = C.green}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <button type="submit" style={{
              background: C.greenDim, border: `1px solid rgba(240,246,252,0.1)`, color: '#fff',
              padding: '9px', borderRadius: 6, cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,160,67,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.greenDim; e.currentTarget.style.boxShadow = 'none' }}
            >
              Get Started <FaPaperPlane style={{ fontSize: '0.75rem' }} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...containerStyle, height: '500px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AliceLogo size={26} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: C.text, fontSize: '0.9rem', fontWeight: 600 }}>Alice AI</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, display: 'inline-block' }} />
            </div>
            <p style={{ color: C.muted, fontSize: '0.68rem', marginTop: 1 }}>
              {userName ? `Chatting as ${userName}` : 'Proctoring Assistant'}
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, background: C.bg }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <AliceLogo size={20} />
            )}
            <div style={{
              maxWidth: '78%',
              padding: '9px 13px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              fontSize: '0.83rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              ...(msg.role === 'user'
                ? { background: C.greenBg, border: `1px solid ${C.greenBorder}`, color: C.text }
                : { background: C.surface, border: `1px solid ${C.border}`, color: C.text }
              )
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            <AliceLogo size={20} />
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '10px 14px', borderRadius: '12px 12px 12px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.muted, display: 'inline-block', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, background: C.surface }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Alice anything..."
          disabled={loading}
          style={{
            flex: 1, background: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: 6, padding: '8px 12px', color: C.text,
            fontSize: '0.83rem', outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() && !loading ? C.greenDim : C.surface2,
            border: `1px solid ${input.trim() && !loading ? 'rgba(240,246,252,0.1)' : C.border}`,
            color: input.trim() && !loading ? '#fff' : C.muted,
            borderRadius: 6, padding: '0 14px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.background = C.green; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,160,67,0.2)' }}}
          onMouseLeave={e => { e.currentTarget.style.background = input.trim() && !loading ? C.greenDim : C.surface2; e.currentTarget.style.boxShadow = 'none' }}
        >
          <FaPaperPlane style={{ fontSize: '0.8rem' }} />
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #484f58; }
      `}</style>
    </div>
  )
}

export default AliceAIChat
