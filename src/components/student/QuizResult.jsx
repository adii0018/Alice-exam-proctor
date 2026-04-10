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
  FiActivity,
  FiUser,
  FiMail
} from 'react-icons/fi'

const StatBox = ({ icon: Icon, label, value, colorClass = 'text-blue-600' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
  >
    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span>{label}</span>
    </div>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </motion.div>
)

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const QuizResult = ({ result, quiz, onBackToDashboard }) => {
  const {
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    timeTaken,
    percentage,
    violations = [],
    submittedAt,
  } = result

  // Read student info from localStorage
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  })()
  const studentName  = user.name  || user.username  || user.full_name  || 'Student'
  const studentEmail = user.email || user.gmail     || ''
  const initials     = getInitials(studentName)

  const [showViolations, setShowViolations] = useState(false)
  const hasAcademicScore = Number.isFinite(score) && score !== null && Number.isFinite(percentage) && percentage !== null
  const passed = hasAcademicScore ? percentage >= 60 : false
  const unattempted = (Number.isFinite(totalQuestions) && Number.isFinite(correctAnswers) && Number.isFinite(wrongAnswers))
    ? Math.max(0, totalQuestions - correctAnswers - wrongAnswers)
    : '--'

  const totalViolations  = violations.length
  const highSeverity     = violations.filter(v => v.severity === 'high').length
  const mediumSeverity   = violations.filter(v => v.severity === 'medium').length
  const lowSeverity      = violations.filter(v => v.severity === 'low').length

  const submittedAtFormatted = submittedAt
    ? new Date(submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10">
      <div className="mx-auto w-full max-w-5xl px-4">

        {/* ── Header card: Exam info + Student info + Score ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          {/* Top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">

              {/* Left: Exam title + Student card */}
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Exam Completed</h1>
                  <p className="mt-1 text-sm text-gray-500">{quiz.title}</p>
                  {submittedAtFormatted && (
                    <p className="mt-1 text-xs text-gray-400">Submitted: {submittedAtFormatted}</p>
                  )}
                  <p className="mt-1.5 text-sm text-green-600 font-medium">
                    ✓ Your responses were submitted successfully.
                  </p>
                </div>

                {/* Student Info Card */}
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-base shadow-sm">
                    {initials}
                  </div>

                  {/* Name + Email */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <FiUser className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <p className="text-sm font-semibold text-gray-800 truncate">{studentName}</p>
                    </div>
                    {studentEmail && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <FiMail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <p className="text-xs text-gray-500 truncate">{studentEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Score */}
              <div className="text-right shrink-0">
                <p className="text-sm text-gray-500 mb-1">Final Score</p>
                <p className="text-4xl font-extrabold text-blue-700">
                  {hasAcademicScore ? `${score}/${totalQuestions}` : '--'}
                </p>
                {hasAcademicScore && (
                  <p className="text-lg font-semibold text-gray-600 mt-0.5">{percentage}%</p>
                )}
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  hasAcademicScore
                    ? passed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {hasAcademicScore ? (passed ? '✓ Passed' : '✗ Failed') : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <StatBox icon={FiFileText}    label="Total"   value={totalQuestions}                                          colorClass="text-blue-700"   />
          <StatBox icon={FiCheckCircle} label="Correct" value={Number.isFinite(correctAnswers) ? correctAnswers : '--'} colorClass="text-green-700"  />
          <StatBox icon={FiXCircle}     label="Wrong"   value={Number.isFinite(wrongAnswers)   ? wrongAnswers   : '--'} colorClass="text-red-700"    />
          <StatBox icon={FiAlertCircle} label="Skipped" value={unattempted}                                             colorClass="text-gray-700"   />
          <StatBox icon={FiClock}       label="Time"    value={timeTaken || '--'}                                       colorClass="text-purple-700" />
        </motion.div>

        {/* ── Proctoring Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <FiShield className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Proctoring Summary</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox icon={FiEye}      label="Total Violations" value={totalViolations} colorClass="text-blue-700"   />
            <StatBox icon={FiActivity} label="High"             value={highSeverity}    colorClass="text-red-700"    />
            <StatBox icon={FiActivity} label="Medium"           value={mediumSeverity}  colorClass="text-orange-600" />
            <StatBox icon={FiActivity} label="Low"              value={lowSeverity}     colorClass="text-yellow-600" />
          </div>

          {totalViolations > 0 && (
            <button
              onClick={() => setShowViolations(!showViolations)}
              className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              {showViolations ? 'Hide violation details' : 'View violation details'}
            </button>
          )}
        </motion.div>

        {/* ── Violation Timeline ── */}
        {showViolations && totalViolations > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-3 text-base font-semibold text-gray-900">Violation Timeline</h3>
            <div className="space-y-2">
              {violations.map((v, i) => {
                const severityClass =
                  v.severity === 'high'
                    ? 'bg-red-100 text-red-700'
                    : v.severity === 'medium'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-yellow-100 text-yellow-700'

                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span className="min-w-[80px] text-gray-500">{v.timestamp}</span>
                    <span className="font-medium text-gray-800">{String(v.type || '').replace(/_/g, ' ')}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${severityClass}`}>
                      {String(v.severity || 'low').toUpperCase()}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <button
            onClick={onBackToDashboard}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <FiHome />
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiDownload />
            Download Result
          </button>
        </motion.div>

      </div>
    </div>
  )
}

export default QuizResult
