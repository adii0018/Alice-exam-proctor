import { useState, useEffect, useRef } from 'react'
import { quizAPI, violationAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaClock } from 'react-icons/fa'
import ProctorSidebar from '../exam/ProctorSidebar'
import QuizResult from './QuizResult'
import useProctoring, { Decision } from '../../hooks/useProctoring'
import useWebcamScreenshot from '../../hooks/useWebcamScreenshot'

const QuizInterface = ({ quiz, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [submitting, setSubmitting] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [startTime] = useState(Date.now())
  const [screenshots, setScreenshots] = useState([])

  const videoRef = useRef(null)

  // ── Proctoring ──────────────────────────────────────────────────────────
  const {
    isReady, faceCount, isLookingAway, gazeDirection,
    score, decision, tabSwitchCount, violations, getReport,
  } = useProctoring({
    videoRef,
    enabled: true,
    onViolation: async (entry) => {
      // Capture screenshot on violation
      const screenshot = captureScreenshot()
      if (screenshot) {
        setScreenshots(prev => [...prev, {
          ...screenshot,
          violationType: entry.type,
          severity: entry.severity,
        }])
        console.log('[Screenshot] Captured on violation:', entry.type)
      }

      // Persist violation to backend with screenshot
      try {
        await violationAPI.create({
          quiz_id: quiz._id,
          violation_type: entry.type,
          severity: entry.severity,
          metadata: entry,
          screenshot: screenshot?.data || null, // Send base64 image
        })
      } catch (error) {
        console.error('[Violation] Failed to save:', error)
      }
    },
  })

  // ── Webcam Screenshots (manual capture only) ────────────────────────────
  const { captureScreenshot } = useWebcamScreenshot({
    videoRef,
    enabled: false, // Disable periodic capture
    onScreenshot: null, // No callback needed
    quality: 0.7,
  })

  // Warn student when risk score crosses thresholds
  useEffect(() => {
    if (decision === Decision.CHEATING) {
      toast.error('⚠️ High risk activity detected. Your session is being recorded.', { id: 'cheat-high', duration: 5000 })
    } else if (decision === Decision.SUSPECT) {
      toast('Suspicious activity detected. Please focus on your exam.', { id: 'cheat-med', icon: '⚠️', duration: 4000 })
    }
  }, [decision])

  // Auto-submit when timer expires
  useEffect(() => {
    if (timeLeft === 0 && !submitting && !quizResult) {
      toast.info('⏱️ Time expired! Auto-submitting your quiz...')
      handleSubmit()
    } else if (timeLeft === 60) {
      toast.warning('⏰ Only 1 minute remaining!', { duration: 4000 })
    } else if (timeLeft === 300) {
      toast('⏰ 5 minutes remaining', { icon: '⏱️', duration: 3000 })
    }
  }, [timeLeft])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async () => {
    if (submitting || quizResult) return // Prevent double submission
    setSubmitting(true)

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const timeString = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`

      let correctAnswers = 0, wrongAnswers = 0
      
      console.log('[Quiz Debug] Checking answers...')
      quiz.questions.forEach((q) => {
        const questionId = q._id
        const userAnswer = answers[questionId]
        const correctAnswer = q.correctAnswer
        
        console.log(`Q: "${q.text}"`)
        console.log(`  Question ID: ${questionId}`)
        console.log(`  User Answer: "${userAnswer}"`)
        console.log(`  Correct Answer: "${correctAnswer}"`)
        console.log(`  Match: ${userAnswer === correctAnswer}`)
        
        if (userAnswer === correctAnswer) {
          correctAnswers++
          console.log('  ✓ CORRECT')
        } else if (userAnswer) {
          wrongAnswers++
          console.log('  ✗ WRONG')
        } else {
          console.log('  - SKIPPED')
        }
      })

      const totalQuestions = quiz.questions.length
      const percentage = Math.round((correctAnswers / totalQuestions) * 100)
      
      console.log(`[Quiz Result] ${correctAnswers}/${totalQuestions} = ${percentage}%`)

      // Attach proctoring report to submission
      const proctoringReport = getReport()
      const response = await quizAPI.submit(quiz._id, { 
        answers, 
        proctoringReport: {
          ...proctoringReport,
          screenshots: screenshots.map(s => ({
            timestamp: s.timestamp,
            violationType: s.violationType,
            severity: s.severity,
            // Store full base64 image data
            imageData: s.data,
          })),
          screenshotCount: screenshots.length,
        }
      })

      setQuizResult({
        score: correctAnswers,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        timeTaken: timeString,
        percentage,
        violations:       response.data?.violations ?? violations,
        proctoringScore:  score,
        proctoringDecision: decision,
      })

      toast.success('Quiz submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit quiz')
      setSubmitting(false)
    }
  }

  // ── Camera setup ────────────────────────────────────────────────────────
  useEffect(() => {
    let stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(() => toast.error('Camera access required for proctoring'))
    return () => stream?.getTracks().forEach(t => t.stop())
  }, [])

  // ── Block copy-paste and right-click ────────────────────────────────────
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      toast.error('Right-click is disabled during exam', { id: 'right-click' })
    }

    const handleCopy = (e) => {
      e.preventDefault()
      toast.error('Copy is disabled during exam', { id: 'copy' })
    }

    const handlePaste = (e) => {
      e.preventDefault()
      toast.error('Paste is disabled during exam', { id: 'paste' })
    }

    const handleCut = (e) => {
      e.preventDefault()
      toast.error('Cut is disabled during exam', { id: 'cut' })
    }

    const handleKeyDown = (e) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+P, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'a', 'p'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault()
        toast.error('This action is disabled during exam', { id: 'keyboard-block' })
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('cut', handleCut)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const question = quiz.questions[currentQuestion]

  if (quizResult) {
    return <QuizResult result={quizResult} quiz={quiz} onBackToDashboard={onExit} />
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <div className="lg:col-span-3">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <div className="text-xl font-semibold text-primary-600 flex items-center gap-2">
              <FaClock />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question._id] === option
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => setAnswers({ ...answers, [question._id]: option })}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting…' : 'Submit Quiz'}
              </button>
            ) : (
              <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="btn-primary">
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <ProctorSidebar
          videoRef={videoRef}
          faceCount={faceCount}
          isLookingAway={isLookingAway}
          gazeDirection={gazeDirection}
          score={score}
          decision={decision}
          tabSwitchCount={tabSwitchCount}
          violations={violations}
          isReady={isReady}
        />
      </div>
    </div>
  )
}

export default QuizInterface
