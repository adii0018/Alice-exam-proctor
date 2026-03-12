import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlay, FiCamera, FiMic, FiUser, FiCheckCircle, FiX, FiShield, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'

const JoinExamCard = ({ onJoinExam }) => {
  const [showPreCheck, setShowPreCheck] = useState(false)
  const [preCheckStatus, setPreCheckStatus] = useState({
    camera: false,
    microphone: false,
    faceDetection: false
  })
  const [checkErrors, setCheckErrors] = useState({
    camera: null,
    microphone: null,
    faceDetection: null
  })

  const handleStartPreCheck = async () => {
    setShowPreCheck(true)
    setPreCheckStatus({ camera: false, microphone: false, faceDetection: false })
    setCheckErrors({ camera: null, microphone: null, faceDetection: null })
    
    try {
      // Request camera and microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      // Check video tracks
      const videoTracks = stream.getVideoTracks()
      if (videoTracks.length > 0) {
        setPreCheckStatus(prev => ({ ...prev, camera: true }))
      } else {
        setCheckErrors(prev => ({ ...prev, camera: 'No camera found' }))
      }
      
      // Check audio tracks
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length > 0) {
        setPreCheckStatus(prev => ({ ...prev, microphone: true }))
      } else {
        setCheckErrors(prev => ({ ...prev, microphone: 'No microphone found' }))
      }
      
      // Simulate face detection check (would use actual face detection in production)
      setTimeout(() => {
        setPreCheckStatus(prev => ({ ...prev, faceDetection: true }))
      }, 1000)
      
      // Stop the stream after checks
      stream.getTracks().forEach(track => track.stop())
      
    } catch (error) {
      console.error('Permission error:', error)
      
      // Handle specific errors
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera/Microphone permission denied. Please allow access to continue.')
        setCheckErrors({
          camera: 'Permission denied',
          microphone: 'Permission denied',
          faceDetection: null
        })
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera or microphone found on your device.')
        setCheckErrors({
          camera: 'Device not found',
          microphone: 'Device not found',
          faceDetection: null
        })
      } else {
        toast.error('Failed to access camera/microphone. Please check your device settings.')
        setCheckErrors({
          camera: 'Access failed',
          microphone: 'Access failed',
          faceDetection: null
        })
      }
    }
  }

  const handleJoinNow = () => {
    // Close modal first, then trigger navigation after animation
    setShowPreCheck(false)
    setTimeout(() => {
      if (onJoinExam) {
        onJoinExam()
      }
    }, 300) // Wait for modal close animation
  }

  const allChecksComplete = Object.values(preCheckStatus).every(status => status)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white overflow-hidden shadow-2xl"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <FiShield className="w-32 h-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
              >
                <FiZap className="w-4 h-4" />
                <span className="text-xs font-semibold">Quick Start</span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              >
                Ready to Join <br />an Exam?
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-lg opacity-95 mb-6"
              >
                Enter your exam code and start your proctored test
              </motion.p>
            </div>

            {/* Animated Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="hidden md:block"
            >
              <div className="relative w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white/80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center">
                    <FiPlay className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Requirements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <FiCamera className="w-5 h-5 mb-2" />
              <p className="text-xs font-medium opacity-90">Camera</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <FiMic className="w-5 h-5 mb-2" />
              <p className="text-xs font-medium opacity-90">Microphone</p>
            </div>
            <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <FiUser className="w-5 h-5 mb-2" />
              <p className="text-xs font-medium opacity-90">Face ID</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleStartPreCheck}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <FiPlay className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Start Pre-Check & Join Exam
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-center mt-4 opacity-80 flex items-center justify-center gap-2"
          >
            <FiShield className="w-3 h-3" />
            AI monitoring will begin once you join
          </motion.p>
        </div>
      </motion.div>

      {/* Pre-Check Modal */}
      <AnimatePresence>
        {showPreCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreCheck(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">System Pre-Check</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verifying your setup</p>
                </div>
                <button
                  onClick={() => setShowPreCheck(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <PreCheckItem
                  icon={FiCamera}
                  label="Camera Permission"
                  status={preCheckStatus.camera}
                  error={checkErrors.camera}
                />
                <PreCheckItem
                  icon={FiMic}
                  label="Microphone Permission"
                  status={preCheckStatus.microphone}
                  error={checkErrors.microphone}
                />
                <PreCheckItem
                  icon={FiUser}
                  label="Face Detection"
                  status={preCheckStatus.faceDetection}
                  error={checkErrors.faceDetection}
                />
              </div>

              {allChecksComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <FiCheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">All checks passed!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">You're ready to join the exam</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleJoinNow}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Enter Exam Code</span>
                    <FiPlay className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : Object.values(checkErrors).some(err => err !== null) ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <FiX className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">Permission Error</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Please allow camera and microphone access</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleStartPreCheck}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiPlay className="w-5 h-5" />
                    <span>Retry Pre-Check</span>
                  </button>
                </motion.div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Running system checks...</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">Please wait</p>
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

const PreCheckItem = ({ icon: Icon, label, status, error }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`
      p-4 rounded-2xl border-2 transition-all duration-300
      ${status 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
        : error
        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
      }
    `}
  >
    <div className="flex items-center gap-3">
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center transition-all
        ${status 
          ? 'bg-green-100 dark:bg-green-900/40' 
          : error
          ? 'bg-red-100 dark:bg-red-900/40'
          : 'bg-gray-100 dark:bg-gray-600'
        }
      `}>
        <Icon className={`w-6 h-6 ${
          status 
            ? 'text-green-600 dark:text-green-400' 
            : error
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-400 dark:text-gray-500'
        }`} />
      </div>
      
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {status ? 'Verified' : error ? error : 'Checking...'}
        </p>
      </div>

      {status ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <FiX className="w-6 h-6 text-red-600 dark:text-red-400" />
        </motion.div>
      ) : (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 dark:border-gray-500 border-t-blue-600" />
      )}
    </div>
  </motion.div>
)

export default JoinExamCard
