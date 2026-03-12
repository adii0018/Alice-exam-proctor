import { useState, useEffect } from 'react'
import { quizAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaClock, FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import ProctoringMonitor from './ProctoringMonitor'
import QuizResult from './QuizResult'

const QuizInterface = ({ quiz, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [submitting, setSubmitting] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [startTime] = useState(Date.now())

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

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Calculate results
      const timeTaken = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(timeTaken / 60)
      const seconds = timeTaken % 60
      const timeString = `${minutes}m ${seconds}s`

      let correctAnswers = 0
      let wrongAnswers = 0

      quiz.questions.forEach((question) => {
        if (answers[question._id] === question.correctAnswer) {
          correctAnswers++
        } else if (answers[question._id]) {
          wrongAnswers++
        }
      })

      const totalQuestions = quiz.questions.length
      const score = correctAnswers
      const percentage = Math.round((correctAnswers / totalQuestions) * 100)

      // Submit to backend
      const response = await quizAPI.submit(quiz._id, { answers })
      
      // Show result page with violations from backend (if available)
      setQuizResult({
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        timeTaken: timeString,
        percentage,
        violations: response.data?.violations || []
      })

      toast.success('Quiz submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit quiz')
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const question = quiz.questions[currentQuestion]

  // Show result page if quiz is completed
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
                    onChange={() => handleAnswerSelect(question._id, option)}
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
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <ProctoringMonitor quizId={quiz._id} />
      </div>
    </div>
  )
}

export default QuizInterface
