import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiCalendar, FiPlay, FiCheckCircle } from 'react-icons/fi'

const UpcomingExams = () => {
  const navigate = useNavigate()
  const exams = [
    {
      id: 1,
      subject: 'Advanced Mathematics',
      date: '2026-02-20',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'upcoming',
      instructor: 'Dr. Smith',
      questions: 50
    },
    {
      id: 2,
      subject: 'Computer Science Fundamentals',
      date: '2026-02-19',
      time: '2:00 PM',
      duration: '1.5 hours',
      status: 'live',
      instructor: 'Prof. Johnson',
      questions: 40
    },
    {
      id: 3,
      subject: 'Physics Quantum Mechanics',
      date: '2026-02-22',
      time: '11:30 AM',
      duration: '3 hours',
      status: 'upcoming',
      instructor: 'Dr. Williams',
      questions: 60
    },
    {
      id: 4,
      subject: 'English Literature',
      date: '2026-02-18',
      time: '9:00 AM',
      duration: '2 hours',
      status: 'completed',
      instructor: 'Ms. Davis',
      questions: 45
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-green-100 text-green-700 border-green-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    
    const labels = {
      live: 'Live Now',
      upcoming: 'Upcoming',
      completed: 'Completed'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Exams</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/50 transition-all duration-300"
          >
            {/* Status Indicator */}
            {exam.status === 'live' && (
              <div className="absolute top-4 right-4">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {exam.subject}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.instructor}</p>
              </div>
              {getStatusBadge(exam.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiCalendar className="w-4 h-4" />
                <span>{new Date(exam.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiClock className="w-4 h-4" />
                <span>{exam.time} • {exam.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FiCheckCircle className="w-4 h-4" />
                <span>{exam.questions} Questions</span>
              </div>
            </div>

            {exam.status === 'live' ? (
              <button 
                onClick={() => navigate(`/student/exam/${exam.id}`)}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <FiPlay className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Join Exam Now
              </button>
            ) : exam.status === 'upcoming' ? (
              <button className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed">
                Not Available Yet
              </button>
            ) : (
              <button className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
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
