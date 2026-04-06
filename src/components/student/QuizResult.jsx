import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFileText,
  FiDownload,
  FiHome,
  FiAlertCircle,
  FiShield,
  FiEye,
  FiActivity
} from 'react-icons/fi'

// Subtle light background gradient
function LightBackground() {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 0, 
      background: 'linear-gradient(135deg, #f6f8fa 0%, #ffffff 50%, #f6f8fa 100%)',
      pointerEvents: 'none' 
    }}>
      {/* Subtle noise texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(45, 164, 78, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(45, 164, 78, 0.02) 0%, transparent 50%)',
        opacity: 0.6
      }} />
    </div>
  )
}

const StatBox = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue:   { border: '#d0d7de', bg: '#ffffff', text: '#0969da', shadow: 'rgba(9, 105, 218, 0.1)' },
    green:  { border: '#d0d7de', bg: '#ffffff', text: '#2da44e', shadow: 'rgba(45, 164, 78, 0.15)' },
    red:    { border: '#d0d7de', bg: '#ffffff', text: '#cf222e', shadow: 'rgba(207, 34, 46, 0.1)' },
    gray:   { border: '#d0d7de', bg: '#ffffff', text: '#57606a', shadow: 'rgba(87, 96, 106, 0.08)' },
    orange: { border: '#d0d7de', bg: '#ffffff', text: '#bc4c00', shadow: 'rgba(188, 76, 0, 0.1)' },
    yellow: { border: '#d0d7de', bg: '#ffffff', text: '#9a6700', shadow: 'rgba(154, 103, 0, 0.1)' },
  }
  const c = colors[color] || colors.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: `0 4px 12px ${c.shadow}` }}
      style={{
        background: c.bg, 
        border: `1px solid ${c.border}`, 
        borderRadius: 10,
        padding: '18px 16px', 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif",
        boxShadow: `0 1px 3px ${c.shadow}`,
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon style={{ color: c.text, fontSize: '1rem' }} />
        <span style={{ color: '#57606a', fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
      </div>
      <p style={{ color: c.text, fontSize: '1.8rem', fontWeight: 700 }}>{value}</p>
    </motion.div>
  )
}

const QuizResult = ({ result, quiz, onBackToDashboard }) => {
  const {
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    timeTaken,
    percentage,
    violations = []
  } = result

  const [showViolations, setShowViolations] = useState(false)
  const passed = percentage >= 60
  const unattempted = totalQuestions - correctAnswers - wrongAnswers

  const totalViolations  = violations.length
  const highSeverity     = violations.filter(v => v.severity === 'high').length
  const mediumSeverity   = violations.filter(v => v.severity === 'medium').length
  const lowSeverity      = violations.filter(v => v.severity === 'low').length

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f6f8fa', 
      color: '#1f2328', 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif", 
      overflowX: 'hidden' 
    }}>
      <LightBackground />
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f6f8fa; }
        ::-webkit-scrollbar-thumb { background: #d0d7de; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #afb8c1; }
        @keyframes glowPulse { 0%,100%{opacity:0.8} 50%{opacity:1} }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#57606a', fontSize: '0.75rem', fontWeight: 600, marginBottom: 20, letterSpacing: 0.5 }}>
            Exam Session Completed • Results Compiled
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: 16,
              background: passed ? '#dafbe1' : '#ffebe9',
              border: `2px solid ${passed ? '#2da44e' : '#cf222e'}`,
              marginBottom: 24,
              boxShadow: passed ? '0 4px 12px rgba(45, 164, 78, 0.15)' : '0 4px 12px rgba(207, 34, 46, 0.15)'
            }}
          >
            <FiCheckCircle style={{ width: 32, height: 32, color: passed ? '#2da44e' : '#cf222e' }} />
          </motion.div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
            fontWeight: 700, 
            color: '#1f2328', 
            marginBottom: 12,
            letterSpacing: -0.5
          }}>
            Exam Completed
          </h1>
          <p style={{ color: '#57606a', fontSize: '0.95rem', fontWeight: 500 }}>
            Your responses have been submitted and analyzed
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          whileHover={{ scale: 1.01 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{
            background: '#ffffff', 
            border: '1px solid #d0d7de',
            borderRadius: 16, 
            padding: '40px 36px', 
            boxShadow: '0 2px 8px rgba(31, 35, 40, 0.08)',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 36, alignItems: 'center' }}>
              {/* Score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    style={{ 
                      fontSize: 'clamp(4rem, 10vw, 6rem)', 
                      fontWeight: 700, 
                      color: '#2da44e', 
                      lineHeight: 1 
                    }}
                  >
                    {score}
                  </motion.span>
                  <span style={{ fontSize: '2rem', color: '#57606a', fontWeight: 500 }}>/ {totalQuestions}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2328' }}>{percentage}%</span>
                  <span style={{
                    padding: '6px 14px', 
                    borderRadius: 20, 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: passed ? '#dafbe1' : '#ffebe9',
                    color: passed ? '#2da44e' : '#cf222e',
                    border: `1px solid ${passed ? '#2da44e' : '#cf222e'}`
                  }}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              {/* Exam Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ 
                  background: '#f6f8fa', 
                  border: '1px solid #d0d7de', 
                  borderRadius: 10, 
                  padding: '16px 18px', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 14 
                }}>
                  <FiFileText style={{ color: '#2da44e', marginTop: 2, flexShrink: 0, fontSize: '1.1rem' }} />
                  <div>
                    <p style={{ color: '#57606a', fontSize: '0.75rem', fontWeight: 600, marginBottom: 6 }}>Exam Name</p>
                    <p style={{ color: '#1f2328', fontSize: '0.95rem', fontWeight: 600 }}>{quiz.title}</p>
                  </div>
                </div>
                <div style={{ 
                  background: '#f6f8fa', 
                  border: '1px solid #d0d7de', 
                  borderRadius: 10, 
                  padding: '16px 18px', 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 14 
                }}>
                  <FiClock style={{ color: '#2da44e', marginTop: 2, flexShrink: 0, fontSize: '1.1rem' }} />
                  <div>
                    <p style={{ color: '#57606a', fontSize: '0.75rem', fontWeight: 600, marginBottom: 6 }}>Time Taken</p>
                    <p style={{ color: '#1f2328', fontSize: '0.95rem', fontWeight: 600 }}>{timeTaken}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 32 }}>
          <p style={{ color: '#57606a', fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>Performance Breakdown</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            <StatBox icon={FiFileText}    label="Total"     value={totalQuestions}  color="blue"  />
            <StatBox icon={FiCheckCircle} label="Correct"   value={correctAnswers}  color="green" />
            <StatBox icon={FiXCircle}     label="Wrong"     value={wrongAnswers}    color="red"   />
            <StatBox icon={FiAlertCircle} label="Skipped"   value={unattempted}     color="gray"  />
          </div>
        </motion.div>

        {/* AI Proctoring Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }} 
          whileHover={{ scale: 1.01 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #d0d7de', 
            borderRadius: 14, 
            padding: '32px 32px',
            boxShadow: '0 2px 8px rgba(31, 35, 40, 0.08)',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 12, 
                background: '#dafbe1', 
                border: '1px solid #2da44e', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <FiShield style={{ color: '#2da44e', fontSize: '1.3rem' }} />
              </div>
              <div>
                <h2 style={{ color: '#1f2328', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>AI Proctoring Summary</h2>
                <p style={{ color: '#57606a', fontSize: '0.8rem' }}>Monitoring status: Completed</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
              <StatBox icon={FiEye}      label="Total"  value={totalViolations} color="blue"   />
              <StatBox icon={FiActivity} label="High"   value={highSeverity}    color="red"    />
              <StatBox icon={FiActivity} label="Medium" value={mediumSeverity}  color="orange" />
              <StatBox icon={FiActivity} label="Low"    value={lowSeverity}     color="yellow" />
            </div>

            {totalViolations > 0 && (
              <button
                onClick={() => setShowViolations(!showViolations)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2da44e', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer', 
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif", 
                  fontWeight: 600,
                  padding: 0,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2c974b'}
                onMouseLeave={(e) => e.target.style.color = '#2da44e'}
              >
                {showViolations ? '← Hide' : '→ View'} Violation Timeline
              </button>
            )}
          </div>
        </motion.div>

        {/* Violation Timeline */}
        {showViolations && totalViolations > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            transition={{ duration: 0.3 }} 
            style={{ marginBottom: 32 }}
          >
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #d0d7de', 
              borderRadius: 12, 
              padding: '24px 28px',
              boxShadow: '0 2px 8px rgba(31, 35, 40, 0.08)'
            }}>
              <p style={{ color: '#57606a', fontSize: '0.8rem', fontWeight: 600, marginBottom: 20 }}>Violation Timeline</p>
              {violations.map((v, i) => {
                const sColor = v.severity === 'high' ? '#cf222e' : v.severity === 'medium' ? '#bc4c00' : '#9a6700'
                const sBg = v.severity === 'high' ? '#ffebe9' : v.severity === 'medium' ? '#fff8c5' : '#fff8c5'
                return (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16, 
                    padding: '14px 0', 
                    borderBottom: i < violations.length - 1 ? '1px solid #d0d7de' : 'none' 
                  }}>
                    <span style={{ color: '#57606a', fontSize: '0.8rem', minWidth: 80, fontWeight: 500 }}>{v.timestamp}</span>
                    <span style={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      background: sColor, 
                      flexShrink: 0,
                      animation: 'glowPulse 2s ease-in-out infinite'
                    }} />
                    <span style={{ color: '#1f2328', fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{v.type}</span>
                    <span style={{ 
                      padding: '4px 10px',
                      borderRadius: 12,
                      background: sBg,
                      color: sColor, 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      border: `1px solid ${sColor}`
                    }}>
                      {v.severity.toUpperCase()}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={onBackToDashboard}
              style={{
                flex: 1, 
                minWidth: 220, 
                padding: '14px 24px', 
                background: '#2da44e',
                border: 'none', 
                color: '#ffffff', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif", 
                fontSize: '0.95rem', 
                fontWeight: 600,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 10,
                boxShadow: '0 2px 8px rgba(45, 164, 78, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#2c974b'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 4px 12px rgba(45, 164, 78, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2da44e'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 2px 8px rgba(45, 164, 78, 0.2)'
              }}
            >
              <FiHome /> Return to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              style={{
                flex: 1, 
                minWidth: 220, 
                padding: '14px 24px', 
                background: '#ffffff',
                border: '1px solid #d0d7de', 
                color: '#1f2328', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif", 
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 10,
                boxShadow: '0 1px 3px rgba(31, 35, 40, 0.08)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f6f8fa'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 4px 12px rgba(31, 35, 40, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 1px 3px rgba(31, 35, 40, 0.08)'
              }}
            >
              <FiDownload /> Download Result
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ marginTop: 56, textAlign: 'center' }}>
          <p style={{ color: '#57606a', fontSize: '0.8rem', fontWeight: 500 }}>
            Proctored by Alice Exam Proctor v2.0
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizResult
