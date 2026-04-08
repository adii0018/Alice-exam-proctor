import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiCalendar, FiPlay, FiCheckCircle } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'

const UpcomingExams = ({ exams = [] }) => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  const darkStatusBadge = {
    live:      { bg: 'rgba(46,160,67,0.1)', color: '#3fb950', border: 'rgba(46,160,67,0.3)' },
    upcoming:  { bg: 'rgba(56,139,253,0.1)', color: '#388bfd', border: 'rgba(56,139,253,0.3)' },
    completed: { bg: 'rgba(110,118,129,0.1)', color: '#8b949e', border: 'rgba(110,118,129,0.3)' },
  }

  const lightStatusBadge = {
    live:      'bg-green-100 text-green-700 border-green-200',
    upcoming:  'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const statusLabel = { live: 'Live Now', upcoming: 'Upcoming', completed: 'Completed' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: darkMode ? '#e6edf3' : '#111827' }}>Upcoming Exams</h3>
        <button style={{ fontSize: '13px', color: darkMode ? '#3fb950' : '#2563eb', fontWeight: 500 }}>View All</button>
      </div>

      {exams.length === 0 ? (
        <div style={{
          backgroundColor: darkMode ? '#161b22' : '#fff',
          border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          color: darkMode ? '#8b949e' : '#6b7280'
        }}>
          No available exams right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.quiz_id || exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={darkMode ? {
                position: 'relative',
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s',
                cursor: 'default',
              } : {}}
              className={darkMode ? '' : 'group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300'}
              onMouseEnter={darkMode ? e => { e.currentTarget.style.borderColor = '#3fb950'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(46,160,67,0.2)' } : undefined}
              onMouseLeave={darkMode ? e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.boxShadow = 'none' } : undefined}
            >
              {exam.is_active && (
                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4
                    style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: darkMode ? '#e6edf3' : '#111827' }}
                    className={darkMode ? '' : 'group-hover:text-blue-600 transition-colors'}
                  >
                    {exam.quiz_title || exam.subject}
                  </h4>
                  <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280' }}>{exam.teacher_name || exam.instructor}</p>
                </div>
                {darkMode ? (
                  <span style={{
                    padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                    backgroundColor: darkStatusBadge.live.bg,
                    color: darkStatusBadge.live.color,
                    border: `1px solid ${darkStatusBadge.live.border}`,
                  }}>
                    {statusLabel.live}
                  </span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${lightStatusBadge.live}`}>
                    {statusLabel.live}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '16px' }} className="space-y-2">
                {[
                  exam.quiz_code ? { icon: FiCalendar, text: `Code: ${exam.quiz_code}` } : null,
                  typeof exam.quiz_duration === 'number' ? { icon: FiClock, text: `Duration: ${exam.quiz_duration} min` } : (exam.duration ? { icon: FiClock, text: `Duration: ${exam.duration}` } : null),
                  typeof exam.questions_count === 'number' ? { icon: FiCheckCircle, text: `${exam.questions_count} Questions` } : null,
                ].filter(Boolean).map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2" style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280' }}>
                    <Icon style={{ width: 14, height: 14 }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/student/exam/${exam.quiz_id || exam.id}`)}
                style={darkMode ? {
                  width: '100%', padding: '10px 16px', borderRadius: '8px',
                  backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
                  color: '#3fb950', fontWeight: 500, fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: 'pointer', transition: 'all 0.2s',
                } : {}}
                className={darkMode ? '' : 'w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2'}
                onMouseEnter={darkMode ? e => { e.currentTarget.style.backgroundColor = 'rgba(46,160,67,0.2)' } : undefined}
                onMouseLeave={darkMode ? e => { e.currentTarget.style.backgroundColor = 'rgba(46,160,67,0.1)' } : undefined}
              >
                <FiPlay style={{ width: 14, height: 14 }} />
                Join Exam Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingExams
