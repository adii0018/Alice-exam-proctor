import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa'

const AliceAIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "// Alice AI online.\nHow can I assist you today?" }
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
        { role: 'assistant', content: `Identity confirmed: ${userName}\nSystem ready. How can I assist?` }
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
        content: '// AI service unavailable.\nAdd GEMINI_API_KEY to django_backend/.env to enable full AI responses.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '380px',
    background: '#0a0a0a',
    border: '1px solid rgba(0,255,159,0.35)',
    borderRadius: '12px',
    boxShadow: '0 0 40px rgba(0,255,159,0.12)',
    zIndex: 50,
    fontFamily: "'JetBrains Mono', monospace",
    overflow: 'hidden',
  }

  const headerStyle = {
    background: 'rgba(0,255,159,0.05)',
    borderBottom: '1px solid rgba(0,255,159,0.2)',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  if (showNamePrompt) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#00ff9f', fontSize: '1.1rem', fontWeight: 700, textShadow: '0 0 10px rgba(0,255,159,0.6)' }}>
              {'>'} Alice AI
            </span>
            <span style={{ color: 'rgba(0,255,159,0.4)', fontSize: '0.65rem', letterSpacing: 2 }}>ONLINE</span>
          </div>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <p style={{ color: 'rgba(0,255,159,0.5)', fontSize: '0.7rem', letterSpacing: 3, marginBottom: 16 }}>// IDENTITY_VERIFICATION</p>
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: 'rgba(0,255,159,0.6)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, letterSpacing: 1 }}>
                <FaUser style={{ fontSize: '0.7rem' }} /> ENTER_NAME_
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="your_name"
                autoFocus
                style={{
                  width: '100%', background: 'rgba(0,255,159,0.04)', border: '1px solid rgba(0,255,159,0.25)',
                  borderRadius: 6, padding: '10px 14px', color: '#fff', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" style={{
              background: 'transparent', border: '1.5px solid #00ff9f', color: '#00ff9f',
              padding: '10px', borderRadius: 6, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              textShadow: '0 0 8px rgba(0,255,159,0.5)', boxShadow: '0 0 12px rgba(0,255,159,0.15)',
              transition: 'all 0.2s'
            }}>
              Initialize Session <FaPaperPlane style={{ fontSize: '0.75rem' }} />
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#00ff9f', fontSize: '1rem', fontWeight: 700, textShadow: '0 0 10px rgba(0,255,159,0.6)' }}>
                {'>'} Alice AI
              </span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff9f', boxShadow: '0 0 6px #00ff9f', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: 1, marginTop: 2 }}>
              {userName ? `user: ${userName}` : 'assistant_mode'}
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              ...(msg.role === 'user'
                ? { background: 'rgba(0,255,159,0.12)', border: '1px solid rgba(0,255,159,0.3)', color: '#e6edf3' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }
              )
            }}>
              {msg.role === 'assistant' && (
                <span style={{ color: 'rgba(0,255,159,0.5)', fontSize: '0.65rem', display: 'block', marginBottom: 4 }}>alice@proctor ~</span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 8 }}>
              <span style={{ color: '#00ff9f', fontSize: '0.85rem', animation: 'blink 1s step-end infinite' }}>█ █ █</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,255,159,0.15)', display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,255,159,0.04)', border: '1px solid rgba(0,255,159,0.2)', borderRadius: 6, padding: '0 12px' }}>
          <span style={{ color: 'rgba(0,255,159,0.4)', fontSize: '0.8rem', marginRight: 6 }}>{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type_message..."
            disabled={loading}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', padding: '10px 0'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() && !loading ? 'rgba(0,255,159,0.1)' : 'transparent',
            border: '1px solid rgba(0,255,159,0.3)', color: '#00ff9f',
            borderRadius: 6, padding: '0 14px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            opacity: input.trim() && !loading ? 1 : 0.4, transition: 'all 0.2s'
          }}
        >
          <FaPaperPlane style={{ fontSize: '0.8rem' }} />
        </button>
      </form>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}

export default AliceAIChat
