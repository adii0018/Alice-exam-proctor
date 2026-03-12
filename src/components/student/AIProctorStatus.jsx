import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiMic, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

const AIProctorStatus = () => {
  const [status, setStatus] = useState({
    camera: true,
    microphone: true,
    faceDetected: true,
    monitoring: true
  })

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly toggle face detection for demo
      setStatus(prev => ({
        ...prev,
        faceDetected: Math.random() > 0.2 // 80% chance of face detected
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const StatusIndicator = ({ icon: Icon, label, active, critical }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative p-4 rounded-2xl border transition-all duration-300
        ${active 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center
          ${active 
            ? 'bg-green-100 dark:bg-green-900/40' 
            : 'bg-red-100 dark:bg-red-900/40'
          }
        `}>
          <Icon className={`w-6 h-6 ${active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          
          {active && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            {active ? (
              <>
                <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
              </>
            ) : (
              <>
                <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Inactive</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Proctor Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time monitoring system</p>
        </div>
        
        {status.monitoring && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium flex items-center gap-2"
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Monitoring Active
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusIndicator
          icon={FiCamera}
          label="Camera"
          active={status.camera}
        />
        <StatusIndicator
          icon={FiMic}
          label="Microphone"
          active={status.microphone}
        />
        <StatusIndicator
          icon={FiUser}
          label="Face Detection"
          active={status.faceDetected}
          critical
        />
      </div>

      {/* AI Confidence Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Confidence Score</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Based on behavioral analysis</p>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            98%
          </div>
        </div>
        
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '98%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
          All systems operational. Continue your exam with confidence.
        </p>
      </motion.div>
    </div>
  )
}

export default AIProctorStatus
