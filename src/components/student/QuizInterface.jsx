import { useState, useEffect, useRef } from 'react'
import { quizAPI, flagAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaClock } from 'react-icons/fa'
import ProctorSidebar from '../exam/ProctorSidebar'
import QuizResult from './QuizResult'
import useProctoring, { Decision } from '../../hooks/useProctoring'

const QuizInterface = ({ quiz, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [submitting, setSubmitting] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [startTime] = useState(Date.now())

  const videoRef = useRef(null)

  // ── Proctoring ──────────────────────────────────────────────────────────
  const {
    isReady, faceCount, isLookingAway, gazeDirection,
    score, decision, tabSwitchCount, violations, getReport,
  } = useProctoring({
    videoRef,
    enabled: true,
    onViolation: async (entry) => {
      // Persist every confirmed violation to the backend
      try {
        await flagAPI.create({
          quiz_id:   quiz._id,
          type:      entry.type,
          severity:  entry.severity,
          timestamp: entry.timestamp,
          metadata:  entry,
        })
      } catch { /* non-blocking */ }
    },
  })

  // Warn student when risk score crosses thresholds
  useEffect(() => {
    if (decision === Decision.CHEATING) {
      toast.error('⚠️ High risk activity detected. Your session is being recorded.', { id: 'cheat-high', duration: 5000 })
    } else if (decision === Decision.SUSPECT) {
      toast('Suspicious activity detected. Please focus on your exam.', { id: 'cheat-med', icon: '⚠️', duration: 4000 })
    }
  }, [decision])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const timeString = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`

      let correctAnswers = 0, wrongAnswers = 0
      quiz.questions.forEach((q) => {
        if (answers[q._id] === q.correctAnswer) correctAnswers++
        else if (answers[q._id]) wrongAnswers++
      })

      const totalQuestions = quiz.questions.length
      const percentage = Math.round((correctAnswers / totalQuestions) * 100)

      // Attach proctoring report to submission
      const proctoringReport = getReport()
      const response = await quizAPI.submit(quiz._id, { answers, proctoringReport })

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
    <div className="grid lg:grid-cols-4 gap-6">
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
