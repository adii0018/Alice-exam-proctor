import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaLeaf, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa'

const AliceAIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Alice, your AI assistant. How can I help you today?' }
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
        { role: 'assistant', content: `Nice to meet you, ${userName}! How can I assist you today?` }
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
      const response = await axios.post('/api/ai/chat/', {
        message: input,
        history: messages
      })
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }])
    } catch (error) {
      // Demo mode fallback
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m running in demo mode. For full functionality, please configure the GROQ_API_KEY in your backend .env file. You can get a free API key from https://console.groq.com/'
      }])
    } finally {
      setLoading(false)
    }
  }

  if (showNamePrompt) {
    return (
      <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl z-50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaLeaf className="text-2xl text-primary-600" />
              <h3 className="text-xl font-bold">Welcome to Alice AI</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FaUser className="text-primary-600" />
                What's your name?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Start Chatting
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaLeaf className="text-2xl" />
          <div>
            <h3 className="font-bold">Alice AI Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FaTimes className="text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  )
}

export default AliceAIChat
