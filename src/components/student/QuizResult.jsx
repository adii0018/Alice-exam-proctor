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

// Static starfield — no animation, no canvas
const stars = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.6 + 0.2,
}))

function StarField() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: '#fff',
          opacity: s.opacity,
        }} />
      ))}
    </div>
  )
}

const StatBox = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue:   { border: 'rgba(0,255,159,0.2)',  bg: 'rgba(0,255,159,0.04)',  text: '#00ff9f' },
    green:  { border: 'rgba(0,255,159,0.35)', bg: 'rgba(0,255,159,0.08)',  text: '#00ff9f' },
    red:    { border: 'rgba(255,80,80,0.3)',   bg: 'rgba(255,80,80,0.06)',  text: '#ff5050' },
    gray:   { border: 'rgba(255,255,255,0.1)', bg: 'rgba(255,255,255,0.03)', text: 'rgba(255,255,255,0.5)' },
    orange: { border: 'rgba(255,160,50,0.3)',  bg: 'rgba(255,160,50,0.06)', text: '#ffa032' },
    yellow: { border: 'rgba(255,220,50,0.3)',  bg: 'rgba(255,220,50,0.06)', text: '#ffdc32' },
  }
  const c = colors[color] || colors.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10,
        padding: '18px 16px', fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Icon style={{ color: c.text, fontSize: '0.9rem' }} />
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', letterSpacing: 1 }}>{label.toUpperCase()}</span>
      </div>
      <p style={{ color: c.text, fontSize: '1.8rem', fontWeight: 700, textShadow: `0 0 12px ${c.text}66` }}>{value}</p>
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', fontFamily: "'JetBrains Mono', monospace", overflowX: 'hidden' }}>
      <StarField />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,159,0.3); border-radius: 3px; }
        @keyframes glowPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      {/* subtle radial glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(0,255,159,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '48px 20px 64px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: 'rgba(0,255,159,0.45)', fontSize: '0.7rem', letterSpacing: 4, marginBottom: 16 }}>
            // exam_session_terminated — results_compiled
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: 16,
              background: passed ? 'rgba(0,255,159,0.1)' : 'rgba(255,80,80,0.1)',
              border: `1px solid ${passed ? 'rgba(0,255,159,0.4)' : 'rgba(255,80,80,0.4)'}`,
              marginBottom: 20,
              boxShadow: passed ? '0 0 24px rgba(0,255,159,0.15)' : '0 0 24px rgba(255,80,80,0.15)'
            }}
          >
            <FiCheckCircle style={{ width: 28, height: 28, color: passed ? '#00ff9f' : '#ff5050' }} />
          </motion.div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#00ff9f', textShadow: '0 0 20px rgba(0,255,159,0.4)', marginBottom: 10 }}>
            Exam Completed
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            Responses submitted. AI analysis complete.
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: 28 }}>
          <div style={{
            background: 'rgba(0,255,159,0.03)', border: '1px solid rgba(0,255,159,0.2)',
            borderRadius: 16, padding: '36px 32px', boxShadow: '0 0 40px rgba(0,255,159,0.06)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, alignItems: 'center' }}>
              {/* Score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', fontWeight: 700, color: '#00ff9f', textShadow: '0 0 30px rgba(0,255,159,0.5)', lineHeight: 1 }}
                  >
                    {score}
                  </motion.span>
                  <span style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.2)' }}>/ {totalQuestions}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{percentage}%</span>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, letterSpacing: 1,
                    background: passed ? 'rgba(0,255,159,0.1)' : 'rgba(255,80,80,0.1)',
                    border: `1px solid ${passed ? 'rgba(0,255,159,0.4)' : 'rgba(255,80,80,0.4)'}`,
                    color: passed ? '#00ff9f' : '#ff5050',
                  }}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>

              {/* Exam Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <FiFileText style={{ color: '#00ff9f', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: 2, marginBottom: 4 }}>EXAM_NAME</p>
                    <p style={{ color: '#e6edf3', fontSize: '0.88rem', fontWeight: 600 }}>{quiz.title}</p>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <FiClock style={{ color: '#00ff9f', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: 2, marginBottom: 4 }}>TIME_TAKEN</p>
                    <p style={{ color: '#e6edf3', fontSize: '0.88rem', fontWeight: 600 }}>{timeTaken}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 28 }}>
          <p style={{ color: 'rgba(0,255,159,0.5)', fontSize: '0.7rem', letterSpacing: 3, marginBottom: 14 }}>// PERFORMANCE_BREAKDOWN</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <StatBox icon={FiFileText}    label="Total"     value={totalQuestions}  color="blue"  />
            <StatBox icon={FiCheckCircle} label="Correct"   value={correctAnswers}  color="green" />
            <StatBox icon={FiXCircle}     label="Wrong"     value={wrongAnswers}    color="red"   />
            <StatBox icon={FiAlertCircle} label="Skipped"   value={unattempted}     color="gray"  />
          </div>
        </motion.div>

        {/* AI Proctoring Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: 28 }}>
          <div style={{ background: 'rgba(0,255,159,0.03)', border: '1px solid rgba(0,255,159,0.18)', borderRadius: 14, padding: '28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,255,159,0.08)', border: '1px solid rgba(0,255,159,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShield style={{ color: '#00ff9f' }} />
              </div>
              <div>
                <h2 style={{ color: '#00ff9f', fontSize: '0.95rem', fontWeight: 700, textShadow: '0 0 8px rgba(0,255,159,0.4)' }}>AI Proctoring Summary</h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 2 }}>monitoring_status: completed</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 18 }}>
              <StatBox icon={FiEye}      label="Total"  value={totalViolations} color="blue"   />
              <StatBox icon={FiActivity} label="High"   value={highSeverity}    color="red"    />
              <StatBox icon={FiActivity} label="Medium" value={mediumSeverity}  color="orange" />
              <StatBox icon={FiActivity} label="Low"    value={lowSeverity}     color="yellow" />
            </div>

            {totalViolations > 0 && (
              <button
                onClick={() => setShowViolations(!showViolations)}
                style={{ background: 'none', border: 'none', color: 'rgba(0,255,159,0.7)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}
              >
                {'>'} {showViolations ? 'hide' : 'view'}_violation_timeline
              </button>
            )}
          </div>
        </motion.div>

        {/* Violation Timeline */}
        {showViolations && totalViolations > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} style={{ marginBottom: 28 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ color: 'rgba(0,255,159,0.5)', fontSize: '0.7rem', letterSpacing: 3, marginBottom: 16 }}>// VIOLATION_TIMELINE</p>
              {violations.map((v, i) => {
                const sColor = v.severity === 'high' ? '#ff5050' : v.severity === 'medium' ? '#ffa032' : '#ffdc32'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < violations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', minWidth: 70 }}>{v.timestamp}</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: sColor, boxShadow: `0 0 6px ${sColor}`, flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{v.type}</span>
                    <span style={{ marginLeft: 'auto', color: sColor, fontSize: '0.65rem', letterSpacing: 1 }}>{v.severity.toUpperCase()}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={onBackToDashboard}
              style={{
                flex: 1, minWidth: 200, padding: '14px 24px', background: 'transparent',
                border: '1.5px solid #00ff9f', color: '#00ff9f', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                textShadow: '0 0 8px rgba(0,255,159,0.5)', boxShadow: '0 0 16px rgba(0,255,159,0.1)',
                transition: 'all 0.2s'
              }}
            >
              <FiHome /> return_to_dashboard()
            </button>
            <button
              onClick={() => window.print()}
              style={{
                flex: 1, minWidth: 200, padding: '14px 24px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <FiDownload /> download_result()
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ color: 'rgba(0,255,159,0.3)', fontSize: '0.7rem', letterSpacing: 2 }}>
            // proctored_by: Alice AI Exam Proctor v2.0
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizResult
