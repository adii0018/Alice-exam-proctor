import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { quizAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FiCode, FiPlay, FiInfo, FiArrowLeft, FiStar } from 'react-icons/fi'

const QuizCodeEntry = ({ onQuizStart, onBack }) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [stars, setStars] = useState([])
  const navigate = useNavigate()

  // Generate random stars for background
  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2
        })
      }
      setStars(newStars)
    }
    generateStars()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting quiz code:', code);
      const response = await quizAPI.getByCode(code)
      console.log('Quiz found:', response.data);
      
      // Validate response
      if (!response.data || !response.data.id) {
        throw new Error('Invalid quiz data received');
      }
      
      toast.success('Quiz found! Starting exam...')
      
      // Navigate to exam page with quiz ID
      setTimeout(() => {
        console.log('Navigating to exam:', response.data.id);
        navigate(`/student/exam/${response.data.id}`)
      }, 500)
      
    } catch (error) {
      console.error('Quiz code error:', error);
      toast.error(error.response?.data?.message || error.message || 'Quiz not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        {/* Back Button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white hover:bg-gray-700/50 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back to Dashboard</span>
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                <FiCode className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Enter Quiz Code
            </h1>
            <p className="text-blue-200 text-lg">
              Enter the 6-digit code to access your exam
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />
            
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Code Input */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-3 flex items-center gap-2">
                    <FiCode className="w-4 h-4" />
                    Quiz Access Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center text-3xl font-bold tracking-[0.5em] text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                      placeholder="ABC123"
                      required
                      maxLength={6}
                    />
                    {code.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {code.length}/6 characters
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-4 px-6 rounded-2xl font-bold text-lg
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    ${loading || code.length !== 6
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      <FiPlay className="w-5 h-5" />
                      Launch Exam
                    </>
                  )}
                </motion.button>
              </form>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20"
              >
                <div className="flex items-start gap-3">
                  <FiInfo className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-200 font-medium mb-1">
                      Before you start
                    </p>
                    <p className="text-xs text-blue-300/80">
                      Ensure your camera and microphone are enabled. AI proctoring will monitor your exam session.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Features */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: '🎥', label: 'Camera' },
                  { icon: '🎤', label: 'Audio' },
                  { icon: '🤖', label: 'AI Monitor' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-center"
                  >
                    <div className="text-2xl mb-1">{feature.icon}</div>
                    <p className="text-xs text-gray-400">{feature.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-400">
              Need help? Contact your instructor for the exam code
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizCodeEntry
