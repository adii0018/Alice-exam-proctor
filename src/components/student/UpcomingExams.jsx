import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiCalendar, FiPlay, FiCheckCircle } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'

const UpcomingExams = () => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()

  const exams = [
    { id: 1, subject: 'Advanced Mathematics', date: '2026-02-20', time: '10:00 AM', duration: '2 hours', status: 'upcoming', instructor: 'Dr. Smith', questions: 50 },
    { id: 2, subject: 'Computer Science Fundamentals', date: '2026-02-19', time: '2:00 PM', duration: '1.5 hours', status: 'live', instructor: 'Prof. Johnson', questions: 40 },
    { id: 3, subject: 'Physics Quantum Mechanics', date: '2026-02-22', time: '11:30 AM', duration: '3 hours', status: 'upcoming', instructor: 'Dr. Williams', questions: 60 },
    { id: 4, subject: 'English Literature', date: '2026-02-18', time: '9:00 AM', duration: '2 hours', status: 'completed', instructor: 'Ms. Davis', questions: 45 },
  ]

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
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
            {exam.status === 'live' && (
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
                  {exam.subject}
                </h4>
                <p style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280' }}>{exam.instructor}</p>
              </div>
              {darkMode ? (
                <span style={{
                  padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                  backgroundColor: darkStatusBadge[exam.status].bg,
                  color: darkStatusBadge[exam.status].color,
                  border: `1px solid ${darkStatusBadge[exam.status].border}`,
                }}>
                  {statusLabel[exam.status]}
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${lightStatusBadge[exam.status]}`}>
                  {statusLabel[exam.status]}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '16px' }} className="space-y-2">
              {[
                { icon: FiCalendar, text: new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                { icon: FiClock, text: `${exam.time} • ${exam.duration}` },
                { icon: FiCheckCircle, text: `${exam.questions} Questions` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2" style={{ fontSize: '13px', color: darkMode ? '#8b949e' : '#6b7280' }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {exam.status === 'live' ? (
              <button
                onClick={() => navigate(`/student/exam/${exam.id}`)}
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
            ) : exam.status === 'upcoming' ? (
              <button
                disabled
                style={darkMode ? {
                  width: '100%', padding: '10px 16px', borderRadius: '8px',
                  backgroundColor: '#21262d', border: '1px solid #30363d',
                  color: '#6e7681', fontWeight: 500, fontSize: '14px', cursor: 'not-allowed',
                } : {}}
                className={darkMode ? '' : 'w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed'}
              >
                Not Available Yet
              </button>
            ) : (
              <button
                style={darkMode ? {
                  width: '100%', padding: '10px 16px', borderRadius: '8px',
                  backgroundColor: 'rgba(56,139,253,0.08)', border: '1px solid rgba(56,139,253,0.2)',
                  color: '#388bfd', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                } : {}}
                className={darkMode ? '' : 'w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors'}
                onMouseEnter={darkMode ? e => { e.currentTarget.style.backgroundColor = 'rgba(56,139,253,0.15)' } : undefined}
                onMouseLeave={darkMode ? e => { e.currentTarget.style.backgroundColor = 'rgba(56,139,253,0.08)' } : undefined}
              >
                View Results
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingExams
