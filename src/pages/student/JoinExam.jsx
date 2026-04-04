import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/student/DashboardLayout'
import JoinExamCard from '../../components/student/JoinExamCard'
import QuizCodeEntry from '../../components/student/QuizCodeEntry'
import QuizInterface from '../../components/student/QuizInterface'

const JoinExam = () => {
  const navigate = useNavigate()
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [showCodeEntry, setShowCodeEntry] = useState(false)

  // Handle quiz start from code entry
  const handleQuizStart = (quiz) => {
    setActiveQuiz(quiz)
    setShowCodeEntry(false)
  }

  // Handle quiz exit
  const handleQuizExit = () => {
    setActiveQuiz(null)
  }

  // Handle join exam button click
  const handleJoinExam = () => {
    setShowCodeEntry(true)
  }

  // If quiz is active, show quiz interface
  if (activeQuiz) {
    return <QuizInterface quiz={activeQuiz} onExit={handleQuizExit} />
  }

  // If code entry is shown, show code entry screen
  if (showCodeEntry) {
    return <QuizCodeEntry onQuizStart={handleQuizStart} onBack={() => setShowCodeEntry(false)} />
  }

  return (
    <DashboardLayout title="Join Exam">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        {/* Join Exam Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <JoinExamCard onJoinExam={handleJoinExam} />
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Before You Start
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Ensure your camera and microphone are working properly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Find a quiet, well-lit environment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Close all unnecessary tabs and applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Make sure you have a stable internet connection</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default JoinExam
