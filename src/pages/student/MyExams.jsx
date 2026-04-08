import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiCheckCircle, FiPlay, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/student/DashboardLayout'
import { studentAPI } from '../../utils/api'

const MyExams = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, upcoming, completed
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await studentAPI.dashboard()
        if (!cancelled) setDashboard(res.data || null)
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const attempted = dashboard?.attempted_exams || []
  const available = dashboard?.available_exams || []

  const attemptedMapped = attempted.map((s) => ({
    id: s.quiz_id,
    title: s.quiz_title,
    subject: s.teacher_name || '',
    date: s.submitted_at,
    time: null,
    duration: typeof s.quiz_duration === 'number' ? `${s.quiz_duration} min` : '',
    status: 'completed',
    score: typeof s.score_percentage === 'number' ? s.score_percentage : null,
    totalQuestions: typeof s.questions_count === 'number' ? s.questions_count : 0,
  }))

  const availableMapped = available.map((q) => ({
    id: q.quiz_id,
    title: q.quiz_title,
    subject: q.teacher_name || '',
    date: null,
    time: null,
    duration: typeof q.quiz_duration === 'number' ? `${q.quiz_duration} min` : '',
    status: 'upcoming',
    score: null,
    totalQuestions: q.questions_count || 0,
  }))

  const filteredExams =
    filter === 'completed'
      ? attemptedMapped
      : filter === 'upcoming'
        ? availableMapped
        : [...attemptedMapped, ...availableMapped]

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-green-100 text-green-700 border-green-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    
    const labels = {
      live: 'Live Now',
      upcoming: 'Upcoming',
      completed: 'Completed'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="My Exams">
        <div className="text-center py-12" style={{ color: '#6b7280' }}>
          Loading your exams...
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="My Exams">
        <div className="text-center py-12" style={{ color: '#f85149' }}>
          Failed to load your exams.
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="My Exams">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Exams
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{exam.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exam.subject}</p>
                </div>
                {getStatusBadge(exam.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    {exam.date
                      ? new Date(exam.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  <span>{exam.time ? `${exam.time} • ${exam.duration}` : exam.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiFileText className="w-4 h-4" />
                  <span>{exam.totalQuestions} Questions</span>
                </div>
              </div>

              {exam.status === 'completed' && exam.score !== null && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Score</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {Number(exam.score).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Number(exam.score)}%` }}
                    />
                  </div>
                </div>
              )}

              {exam.status === 'upcoming' ? (
                <button
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  onClick={() => navigate(`/student/exam/${exam.id}`)}
                >
                  <FiPlay className="w-4 h-4" />
                  Join Now
                </button>
              ) : exam.status === 'completed' ? (
                <button
                  className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => navigate(`/student/exam/${exam.id}/result`)}
                >
                  <FiCheckCircle className="w-4 h-4" />
                  View Results
                </button>
              ) : (
                <button className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed">
                  Not Available Yet
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiFileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No exams found</h3>
            <p className="text-gray-600 dark:text-gray-400">No {filter} exams at the moment</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyExams
