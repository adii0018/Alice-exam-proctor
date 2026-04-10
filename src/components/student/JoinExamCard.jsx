import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiCamera, FiMic, FiUser, FiCheckCircle, FiX, FiShield, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTheme } from '../../contexts/ThemeContext'

const JoinExamCard = ({ onJoinExam }) => {
  const { darkMode } = useTheme()
  const [showPreCheck, setShowPreCheck] = useState(false)
  const [preCheckStatus, setPreCheckStatus] = useState({ camera: false, microphone: false, faceDetection: false })
  const [checkErrors, setCheckErrors] = useState({ camera: null, microphone: null, faceDetection: null })

  const handleStartPreCheck = async () => {
    setShowPreCheck(true)
    setPreCheckStatus({ camera: false, microphone: false, faceDetection: false })
    setCheckErrors({ camera: null, microphone: null, faceDetection: null })
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (stream.getVideoTracks().length > 0) setPreCheckStatus(prev => ({ ...prev, camera: true }))
      else setCheckErrors(prev => ({ ...prev, camera: 'No camera found' }))
      if (stream.getAudioTracks().length > 0) setPreCheckStatus(prev => ({ ...prev, microphone: true }))
      else setCheckErrors(prev => ({ ...prev, microphone: 'No microphone found' }))
      setTimeout(() => setPreCheckStatus(prev => ({ ...prev, faceDetection: true })), 1000)
      stream.getTracks().forEach(t => t.stop())
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera/Microphone permission denied.')
        setCheckErrors({ camera: 'Permission denied', microphone: 'Permission denied', faceDetection: null })
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera or microphone found.')
        setCheckErrors({ camera: 'Device not found', microphone: 'Device not found', faceDetection: null })
      } else {
        toast.error('Failed to access camera/microphone.')
        setCheckErrors({ camera: 'Access failed', microphone: 'Access failed', faceDetection: null })
      }
    }
  }

  const handleJoinNow = () => {
    setShowPreCheck(false)
    setTimeout(() => { if (onJoinExam) onJoinExam() }, 300)
  }

  const allChecksComplete = Object.values(preCheckStatus).every(Boolean)

  return (
    <>
      {darkMode ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative', padding: '32px 40px', borderRadius: '16px',
            backgroundColor: '#161b22', border: '1px solid #30363d', overflow: 'hidden',
          }}
        >
          {/* Green glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(46,160,67,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.05 }}>
            <FiShield style={{ width: 80, height: 80, color: '#3fb950' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', marginBottom: '14px', borderRadius: '9999px',
                  backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
                }}>
                  <FiZap style={{ width: 12, height: 12, color: '#3fb950' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#3fb950' }}>Quick Start</span>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#e6edf3', marginBottom: '10px', lineHeight: 1.2 }}>
                  Ready to Join <br />an Exam?
                </h3>
                <p style={{ fontSize: '14px', color: '#8b949e', marginBottom: '20px' }}>
                  Enter your exam code and start your proctored test
                </p>
              </div>
              <div className="hidden md:block">
                <div style={{ position: 'relative', width: 72, height: 72 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: '2px solid transparent',
                      borderTopColor: '#2ea043', borderRightColor: 'rgba(46,160,67,0.2)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: '12px',
                      backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FiPlay style={{ width: 22, height: 22, color: '#3fb950' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[{ icon: FiCamera, label: 'Camera' }, { icon: FiMic, label: 'Microphone' }, { icon: FiUser, label: 'Face ID' }].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  padding: '12px', borderRadius: '10px',
                  backgroundColor: 'rgba(46,160,67,0.05)', border: '1px solid rgba(46,160,67,0.15)',
                }}>
                  <Icon style={{ width: 18, height: 18, color: '#3fb950', marginBottom: '6px' }} />
                  <p style={{ fontSize: '12px', color: '#8b949e' }}>{label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartPreCheck}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: '10px',
                backgroundColor: '#2ea043', border: 'none', color: 'white',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3fb950'; e.currentTarget.style.boxShadow = '0 0 20px rgba(46,160,67,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2ea043'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <FiPlay style={{ width: 18, height: 18 }} />
              Start Pre-Check & Join Exam
            </button>

            <p style={{ fontSize: '12px', color: '#6e7681', textAlign: 'center', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <FiShield style={{ width: 12, height: 12 }} />
              AI monitoring will begin once you join
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          </div>
          <div className="absolute top-4 right-4 opacity-10"><FiShield className="w-32 h-32" /></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <FiZap className="w-4 h-4" />
                  <span className="text-xs font-semibold">Quick Start</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">Ready to Join <br />an Exam?</h3>
                <p className="text-base md:text-lg opacity-95 mb-6">Enter your exam code and start your proctored test</p>
              </div>
              <div className="hidden md:block">
                <div className="relative w-20 h-20">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center">
                      <FiPlay className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{ icon: FiCamera, label: 'Camera' }, { icon: FiMic, label: 'Microphone' }, { icon: FiUser, label: 'Face ID' }].map(({ icon: Icon, label }) => (
                <div key={label} className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
                  <Icon className="w-5 h-5 mb-2" />
                  <p className="text-xs font-medium opacity-90">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={handleStartPreCheck} className="w-full py-4 px-6 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3">
              <FiPlay className="w-5 h-5" />
              Start Pre-Check & Join Exam
            </button>
            <p className="text-xs text-center mt-4 opacity-80 flex items-center justify-center gap-2">
              <FiShield className="w-3 h-3" />
              AI monitoring will begin once you join
            </p>
          </div>
        </motion.div>
      )}

      {/* Pre-Check Modal */}
      <AnimatePresence>
        {showPreCheck && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowPreCheck(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={darkMode ? {
                backgroundColor: '#161b22', border: '1px solid #30363d',
                borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '100%',
              } : {}}
              className={darkMode ? '' : 'bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl'}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>System Pre-Check</h3>
                  <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280', marginTop: '4px' }}>Verifying your setup</p>
                </div>
                <button
                  onClick={() => setShowPreCheck(false)}
                  style={darkMode ? {
                    padding: '8px', borderRadius: '8px', backgroundColor: 'transparent',
                    border: 'none', cursor: 'pointer', color: '#8b949e',
                  } : {}}
                  className={darkMode ? '' : 'p-2 rounded-xl hover:bg-gray-100 transition-colors'}
                  onMouseEnter={darkMode ? e => { e.currentTarget.style.backgroundColor = '#21262d' } : undefined}
                  onMouseLeave={darkMode ? e => { e.currentTarget.style.backgroundColor = 'transparent' } : undefined}
                >
                  <FiX style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: FiCamera, label: 'Camera Permission', statusKey: 'camera' },
                  { icon: FiMic, label: 'Microphone Permission', statusKey: 'microphone' },
                  { icon: FiUser, label: 'Face Detection', statusKey: 'faceDetection' },
                ].map(({ icon, label, statusKey }) => (
                  <PreCheckItem
                    key={statusKey}
                    icon={icon}
                    label={label}
                    status={preCheckStatus[statusKey]}
                    error={checkErrors[statusKey]}
                    darkMode={darkMode}
                  />
                ))}
              </div>

              {allChecksComplete ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={darkMode ? {
                    padding: '16px', borderRadius: '10px', marginBottom: '16px',
                    backgroundColor: 'rgba(46,160,67,0.08)', border: '1px solid rgba(46,160,67,0.25)',
                  } : {}} className={darkMode ? '' : 'p-4 rounded-2xl bg-green-50 border border-green-200 mb-4'}>
                    <div className="flex items-center gap-3">
                      <div style={darkMode ? {
                        width: 36, height: 36, borderRadius: '50%',
                        backgroundColor: 'rgba(46,160,67,0.15)', border: '1px solid rgba(46,160,67,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      } : { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiCheckCircle style={{ width: 18, height: 18, color: darkMode ? '#3fb950' : 'white' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: darkMode ? '#3fb950' : '#166534' }}>All checks passed!</p>
                        <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#15803d' }}>You're ready to join the exam</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleJoinNow}
                    style={darkMode ? {
                      width: '100%', padding: '12px 24px', borderRadius: '10px',
                      backgroundColor: '#2ea043', border: 'none', color: 'white',
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s',
                    } : {}}
                    className={darkMode ? '' : 'w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2'}
                    onMouseEnter={darkMode ? e => { e.currentTarget.style.backgroundColor = '#3fb950' } : undefined}
                    onMouseLeave={darkMode ? e => { e.currentTarget.style.backgroundColor = '#2ea043' } : undefined}
                  >
                    <span>Continue to Enter Exam Code</span>
                    <FiPlay style={{ width: 16, height: 16 }} />
                  </button>
                </motion.div>
              ) : Object.values(checkErrors).some(e => e !== null) ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={darkMode ? {
                    padding: '16px', borderRadius: '10px', marginBottom: '16px',
                    backgroundColor: 'rgba(248,81,73,0.06)', border: '1px solid rgba(248,81,73,0.25)',
                  } : {}} className={darkMode ? '' : 'p-4 rounded-2xl bg-red-50 border border-red-200 mb-4'}>
                    <div className="flex items-center gap-3">
                      <div style={darkMode ? {
                        width: 36, height: 36, borderRadius: '50%',
                        backgroundColor: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      } : { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiX style={{ width: 18, height: 18, color: darkMode ? '#f85149' : 'white' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: darkMode ? '#f85149' : '#991b1b' }}>Permission Error</p>
                        <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#b91c1c' }}>Please allow camera and microphone access</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleStartPreCheck}
                    style={darkMode ? {
                      width: '100%', padding: '12px 24px', borderRadius: '10px',
                      backgroundColor: 'rgba(56,139,253,0.1)', border: '1px solid rgba(56,139,253,0.3)',
                      color: '#388bfd', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    } : {}}
                    className={darkMode ? '' : 'w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2'}
                  >
                    <FiPlay style={{ width: 16, height: 16 }} />
                    <span>Retry Pre-Check</span>
                  </button>
                </motion.div>
              ) : (
                <div style={darkMode ? {
                  padding: '16px', borderRadius: '10px',
                  backgroundColor: 'rgba(56,139,253,0.06)', border: '1px solid rgba(56,139,253,0.2)',
                } : {}} className={darkMode ? '' : 'p-4 rounded-2xl bg-emerald-50 border border-emerald-200'}>
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent" />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: darkMode ? '#388bfd' : '#065f46' }}>Running system checks...</p>
                      <p style={{ fontSize: '12px', color: darkMode ? '#8b949e' : '#059669', marginTop: '2px' }}>Please wait</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const PreCheckItem = ({ icon: Icon, label, status, error, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    style={darkMode ? {
      padding: '14px', borderRadius: '10px',
      backgroundColor: status ? 'rgba(46,160,67,0.06)' : error ? 'rgba(248,81,73,0.06)' : '#21262d',
      border: `1px solid ${status ? 'rgba(46,160,67,0.3)' : error ? 'rgba(248,81,73,0.3)' : '#30363d'}`,
      transition: 'all 0.3s',
    } : {}}
    className={darkMode ? '' : `p-4 rounded-2xl border-2 transition-all duration-300 ${status ? 'bg-green-50 border-green-300' : error ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}
  >
    <div className="flex items-center gap-3">
      <div style={darkMode ? {
        width: 40, height: 40, borderRadius: '8px',
        backgroundColor: status ? 'rgba(46,160,67,0.1)' : error ? 'rgba(248,81,73,0.1)' : '#161b22',
        border: `1px solid ${status ? 'rgba(46,160,67,0.3)' : error ? 'rgba(248,81,73,0.3)' : '#30363d'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      } : {}} className={darkMode ? '' : `w-12 h-12 rounded-xl flex items-center justify-center ${status ? 'bg-green-100' : error ? 'bg-red-100' : 'bg-gray-100'}`}>
        <Icon style={{ width: 18, height: 18, color: darkMode ? (status ? '#3fb950' : error ? '#f85149' : '#6e7681') : undefined }}
          className={darkMode ? '' : `w-6 h-6 ${status ? 'text-green-600' : error ? 'text-red-600' : 'text-gray-400'}`}
        />
      </div>
      <div className="flex-1">
        <p style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>{label}</p>
        <p style={{ fontSize: '12px', color: darkMode ? '#8b949e' : '#6b7280', marginTop: '2px' }}>
          {status ? 'Verified' : error ? error : 'Checking...'}
        </p>
      </div>
      {status ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <FiCheckCircle style={{ width: 20, height: 20, color: darkMode ? '#3fb950' : '#16a34a' }} />
        </motion.div>
      ) : error ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <FiX style={{ width: 20, height: 20, color: darkMode ? '#f85149' : '#dc2626' }} />
        </motion.div>
      ) : (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-emerald-600" />
      )}
    </div>
  </motion.div>
)

export default JoinExamCard
