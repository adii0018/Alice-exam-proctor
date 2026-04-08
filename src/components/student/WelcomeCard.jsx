import { motion } from 'framer-motion'
import { FiZap, FiShield, FiEye, FiCpu } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const WelcomeCard = ({ stats = null }) => {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const safeStats = stats || {}
  const activeExams = Number(safeStats.available_exams_count || 0)
  const completed = Number(safeStats.total_attempts || 0)
  const successRate = Number(safeStats.pass_rate || 0)

  if (darkMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          padding: '32px 40px',
          color: '#e6edf3',
        }}
      >
        {/* Subtle green glow top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(46,160,67,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              {/* AI Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 14px', marginBottom: '16px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(46,160,67,0.1)',
                  border: '1px solid rgba(46,160,67,0.3)',
                }}
              >
                <div className="relative">
                  <FiCpu style={{ width: 14, height: 14, color: '#3fb950' }} />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3fb950' }}>AI-Powered Monitoring Active</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px', lineHeight: 1.2, color: '#e6edf3' }}
              >
                {greeting}, <br />
                <span style={{ color: '#3fb950' }}>{user?.name || 'Student'}</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '1rem', color: '#8b949e', maxWidth: '500px', lineHeight: 1.6 }}
              >
                Your exams are protected by Alice AI. Stay focused and perform your best!
              </motion.p>
            </div>

            {/* Rotating ring visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="hidden lg:block"
            >
              <div className="relative w-32 h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#2ea043',
                    borderRightColor: 'rgba(46,160,67,0.3)',
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: '12px', borderRadius: '50%',
                    border: '2px solid transparent',
                    borderBottomColor: '#3fb950',
                    borderLeftColor: 'rgba(63,185,80,0.2)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '14px',
                    backgroundColor: 'rgba(46,160,67,0.1)',
                    border: '1px solid rgba(46,160,67,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiShield style={{ width: 28, height: 28, color: '#3fb950' }} />
                  </div>
                </div>
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 36, height: 36, borderRadius: '10px',
                    backgroundColor: 'rgba(46,160,67,0.15)',
                    border: '1px solid rgba(46,160,67,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FiEye style={{ width: 16, height: 16, color: '#3fb950' }} />
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{
                    position: 'absolute', bottom: -8, left: -8,
                    width: 36, height: 36, borderRadius: '10px',
                    backgroundColor: 'rgba(46,160,67,0.15)',
                    border: '1px solid rgba(46,160,67,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FiZap style={{ width: 16, height: 16, color: '#3fb950' }} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}
          >
            {[
              { label: 'Active Exams', value: String(activeExams) },
              { label: 'Completed', value: String(completed) },
              { label: 'Success Rate', value: `${successRate.toFixed(1)}%` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(46,160,67,0.06)',
                  border: '1px solid rgba(46,160,67,0.2)',
                }}
              >
                <p style={{ fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e6edf3' }}>{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Light mode — original design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 text-white shadow-2xl"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
            >
              <div className="relative">
                <FiCpu className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                </span>
              </div>
              <span className="text-sm font-semibold">AI-Powered Monitoring Active</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            >
              {greeting}, <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                {user?.name || 'Student'}
              </span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="text-lg md:text-xl opacity-95 max-w-2xl leading-relaxed"
            >
              Your exams are protected by Alice AI. Stay focused and perform your best!
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: 'spring' }} className="hidden lg:block">
            <div className="relative w-32 h-32">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/80" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-3 rounded-full border-4 border-white/20 border-r-white/70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <FiShield className="w-8 h-8 text-white" />
                </div>
              </div>
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <FiEye className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-2 -left-2 w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg">
                <FiZap className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 grid grid-cols-3 gap-4">
          {[{ label: 'Active Exams', value: String(activeExams) }, { label: 'Completed', value: String(completed) }, { label: 'Success Rate', value: `${successRate.toFixed(1)}%` }].map(({ label, value }) => (
            <div key={label} className="relative group">
              <div className="relative px-4 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all">
                <p className="text-sm opacity-90 mb-1">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WelcomeCard
