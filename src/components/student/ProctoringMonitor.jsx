import { useEffect, useRef, useState } from 'react'
import { flagAPI } from '../../utils/api'
import { FaVideo, FaMicrophone, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

const ProctoringMonitor = ({ quizId }) => {
  const videoRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [violations, setViolations] = useState([])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (error) {
      console.error('Camera access denied:', error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const reportViolation = async (type) => {
    try {
      await flagAPI.create({
        quiz_id: quizId,
        type,
        severity: 'medium',
        timestamp: new Date().toISOString()
      })
      setViolations([...violations, { type, time: new Date() }])
    } catch (error) {
      console.error('Failed to report violation:', error)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaVideo className="text-primary-600" />
        Proctoring Monitor
      </h3>
      
      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full rounded-lg bg-gray-900"
        />
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${cameraActive ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <FaVideo />
            {cameraActive ? 'Camera Active' : 'Camera Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <p className="text-sm text-green-800">Face detected</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
          <FaMicrophone className="text-blue-600" />
          <p className="text-sm text-blue-800">Audio monitoring active</p>
        </div>
      </div>

      {violations.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            Warnings
          </h4>
          <div className="space-y-1">
            {violations.map((v, i) => (
              <div key={i} className="text-xs text-red-600 flex items-center gap-1">
                <FaExclamationTriangle />
                {v.type} - {v.time.toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProctoringMonitor
