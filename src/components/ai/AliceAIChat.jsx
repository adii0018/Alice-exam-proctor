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
  const canvasRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const stars = []
    const starCount = 150
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3
      })
    }
    
    const animate = () => {
      ctx.fillStyle = '#0d1117'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 237, 243, ${star.opacity})`
        ctx.fill()
        
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

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
    width: '420px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 50,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif",
    overflow: 'hidden',
  }

  const headerStyle = {
    background: '#0d1117',
    borderBottom: '1px solid #30363d',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  if (showNamePrompt) {
    return (
      <div style={containerStyle}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
        
        <div style={{ ...headerStyle, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ 
              color: '#e6edf3', 
              fontSize: '1rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              Alice AI
              <span style={{ 
                background: '#2ea043', 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              color: '#8b949e', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.1rem',
              transition: 'color 0.2s',
              padding: 4
            }}
            onMouseEnter={(e) => e.target.style.color = '#e6edf3'}
            onMouseLeave={(e) => e.target.style.color = '#8b949e'}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '28px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: '20px',
            marginBottom: 20
          }}>
            <p style={{ 
              color: '#8b949e', 
              fontSize: '0.875rem', 
              marginBottom: 8,
              fontWeight: 500
            }}>
              Welcome to Alice AI
            </p>
            <p style={{ color: '#6e7681', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Please enter your name to begin the conversation
            </p>
          </div>
          
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ 
                color: '#e6edf3', 
                fontSize: '0.875rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                marginBottom: 10,
                fontWeight: 500
              }}>
                <FaUser style={{ fontSize: '0.75rem', color: '#8b949e' }} /> Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  padding: '10px 12px',
                  color: '#e6edf3',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif",
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2ea043'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>
            <button 
              type="submit" 
              style={{
                background: '#2ea043',
                border: 'none',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif",
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 0 0 0 rgba(46,160,67,0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#2c974b'
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 4px 12px rgba(46,160,67,0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2ea043'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 0 0 0 rgba(46,160,67,0.4)'
              }}
            >
              Start Chat <FaPaperPlane style={{ fontSize: '0.75rem' }} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...containerStyle, height: '550px', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
      
      {/* Header */}
      <div style={{ ...headerStyle, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ 
                color: '#e6edf3', 
                fontSize: '1rem', 
                fontWeight: 600
              }}>
                Alice AI
              </span>
              <span style={{ 
                background: '#2ea043', 
                color: '#ffffff',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  background: '#ffffff',
                  display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                Online
              </span>
            </div>
            {userName && (
              <p style={{ 
                color: '#8b949e', 
                fontSize: '0.75rem', 
                marginTop: 4 
              }}>
                Chatting with {userName}
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ 
            color: '#8b949e', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.1rem',
            transition: 'color 0.2s',
            padding: 4
          }}
          onMouseEnter={(e) => e.target.style.color = '#e6edf3'}
          onMouseLeave={(e) => e.target.style.color = '#8b949e'}
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 14,
        position: 'relative',
        zIndex: 1
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' 
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.875rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              transition: 'transform 0.2s',
              ...(msg.role === 'user'
                ? { 
                    background: '#2ea043', 
                    color: '#ffffff',
                    borderBottomRightRadius: 4
                  }
                : { 
                    background: '#161b22', 
                    border: '1px solid #30363d', 
                    color: '#e6edf3',
                    borderBottomLeftRadius: 4
                  }
              )
            }}>
              {msg.role === 'assistant' && (
                <span style={{ 
                  color: '#8b949e', 
                  fontSize: '0.75rem', 
                  display: 'block', 
                  marginBottom: 6,
                  fontWeight: 600
                }}>
                  Alice AI
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              background: '#161b22', 
              border: '1px solid #30363d', 
              padding: '12px 16px', 
              borderRadius: 8,
              borderBottomLeftRadius: 4
            }}>
              <span style={{ 
                color: '#8b949e', 
                fontSize: '0.875rem'
              }}>
                <span style={{ animation: 'blink 1.4s infinite', animationDelay: '0s' }}>●</span>
                <span style={{ animation: 'blink 1.4s infinite', animationDelay: '0.2s' }}> ●</span>
                <span style={{ animation: 'blink 1.4s infinite', animationDelay: '0.4s' }}> ●</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSend} 
        style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #30363d', 
          display: 'flex', 
          gap: 10,
          position: 'relative',
          zIndex: 1,
          background: '#161b22'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            flex: 1,
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: 6,
            padding: '10px 14px',
            color: '#e6edf3',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif",
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2ea043'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() && !loading ? '#2ea043' : '#0d1117',
            border: '1px solid #30363d',
            color: input.trim() && !loading ? '#ffffff' : '#6e7681',
            borderRadius: 6,
            padding: '0 16px',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !loading) {
              e.target.style.background = '#2c974b'
              e.target.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            if (input.trim() && !loading) {
              e.target.style.background = '#2ea043'
              e.target.style.transform = 'translateY(0)'
            }
          }}
        >
          <FaPaperPlane style={{ fontSize: '0.875rem' }} />
        </button>
      </form>

      <style>{`
        @keyframes blink { 
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }
      `}</style>
    </div>
  )
}

export default AliceAIChat
