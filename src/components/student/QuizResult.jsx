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
import StatCard from './result/StatCard'
import ViolationTimeline from './result/ViolationTimeline'

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

  // Mock violation data (replace with actual data from backend)
  const mockViolations = violations.length > 0 ? violations : [
    { type: 'Face Not Detected', timestamp: '10:23:45', severity: 'medium' },
    { type: 'Multiple Faces', timestamp: '10:45:12', severity: 'high' },
    { type: 'Looking Away', timestamp: '11:02:33', severity: 'low' }
  ]

  const totalViolations = mockViolations.length
  const highSeverity = mockViolations.filter(v => v.severity === 'high').length
  const mediumSeverity = mockViolations.filter(v => v.severity === 'medium').length
  const lowSeverity = mockViolations.filter(v => v.severity === 'low').length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-blue-950/10 dark:via-gray-950 dark:to-purple-950/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/20"
          >
            <FiCheckCircle className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Exam Completed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your responses have been successfully submitted
          </p>
        </motion.div>

        {/* Score Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Gradient border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl opacity-20 blur-sm" />
          
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Score */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-baseline gap-3 mb-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    {score}
                  </motion.span>
                  <span className="text-3xl md:text-4xl font-semibold text-gray-400 dark:text-gray-600">
                    / {totalQuestions}
                  </span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    {percentage}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    passed 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                  }`}>
                    {passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Accuracy Score
                </p>
              </div>

              {/* Right: Exam Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Exam Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quiz.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <FiClock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{timeTaken}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Breakdown
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={FiFileText}
              label="Total Questions"
              value={totalQuestions}
              color="blue"
              delay={0.5}
            />
            <StatCard
              icon={FiCheckCircle}
              label="Correct Answers"
              value={correctAnswers}
              color="green"
              delay={0.6}
            />
            <StatCard
              icon={FiXCircle}
              label="Wrong Answers"
              value={wrongAnswers}
              color="red"
              delay={0.7}
            />
            <StatCard
              icon={FiAlertCircle}
              label="Unattempted"
              value={unattempted}
              color="gray"
              delay={0.8}
            />
          </div>
        </motion.div>

        {/* AI Proctoring Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Proctoring Summary
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitoring status: Completed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViolations}</p>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <FiActivity className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400">High</span>
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{highSeverity}</p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <FiActivity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-orange-600 dark:text-orange-400">Medium</span>
                </div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{mediumSeverity}</p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <FiActivity className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Low</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{lowSeverity}</p>
              </div>
            </div>

            {totalViolations > 0 && (
              <button
                onClick={() => setShowViolations(!showViolations)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {showViolations ? 'Hide' : 'View'} Violation Timeline
              </button>
            )}
          </div>
        </motion.div>

        {/* Violation Timeline */}
        {showViolations && totalViolations > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <ViolationTimeline violations={mockViolations} />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onBackToDashboard}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            <FiHome className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 py-4 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            <FiDownload className="w-5 h-5" />
            Download Result
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Proctored by Alice AI Exam Proctor
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizResult
