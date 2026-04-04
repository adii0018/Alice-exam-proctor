import { motion } from 'framer-motion'
import { FiClock, FiCalendar, FiPlay, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

const ExamSchedule = () => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()

  const exams = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      instructor: 'Dr. Smith',
      date: 'Feb 20, 2026',
      time: '10:00 AM',
      duration: '2 hours',
      questions: 50,
      status: 'upcoming',
      daysLeft: 5,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Computer Science Fundamentals',
      instructor: 'Prof. Johnson',
      date: 'Feb 19, 2026',
      time: '2:00 PM',
      duration: '1.5 hours',
      questions: 40,
      status: 'live',
      color: 'green'
    },
    {
      id: 3,
      title: 'Physics Quantum Mechanics',
      instructor: 'Dr. Williams',
      date: 'Feb 22, 2026',
      time: '11:30 AM',
      duration: '3 hours',
      questions: 60,
      status: 'upcoming',
      daysLeft: 7,
      color: 'purple'
    }
  ]

  const getStatusBadge = (status, daysLeft) => {
    if (status === 'live') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 dark:bg-green-500/20 border border-green-500/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">Live Now</span>
        </div>
      )
    }
    return (
      <div className="px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          {daysLeft} days left
        </span>
      </div>
    )
  }

  const getActionButton = (status, examId) => {
    if (status === 'live') {
      return (
        <button 
          onClick={() => navigate(`/student/exam/${examId}`)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FiPlay className="w-4 h-4" />
          Join Now
        </button>
      )
    }
    return (
      <button className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
        <FiAlertCircle className="w-4 h-4" />
        Not Available
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Exam Schedule</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your upcoming assessments</p>
        </div>
        <button
          onClick={() => navigate('/student/exams')}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 gap-4">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            {/* Color Accent */}
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b ${
              exam.color === 'blue' ? 'from-blue-500 to-blue-600' :
              exam.color === 'green' ? 'from-green-500 to-emerald-600' :
              'from-purple-500 to-purple-600'
            }`} />

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {exam.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      by {exam.instructor}
                    </p>
                  </div>
                  {getStatusBadge(exam.status, exam.daysLeft)}
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{exam.time} • {exam.duration}</span>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="font-semibold">{exam.questions} Questions</span>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Button */}
              <div className="md:w-48">
                {getActionButton(exam.status, exam.id)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Exam Preparation Tips
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Make sure your camera and microphone are working. Join 5 minutes early for system checks.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ExamSchedule
