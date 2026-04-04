import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiCheckCircle, FiPlay, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/student/DashboardLayout'
import toast from 'react-hot-toast'

const MyExams = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, upcoming, completed
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch exams from API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/quizzes/student/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch exams')
        
        const data = await response.json()
        
        // Transform API data to match our format
        const transformedExams = data.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          subject: quiz.subject || 'General',
          date: quiz.scheduled_date || new Date().toISOString().split('T')[0],
          time: quiz.scheduled_time || '10:00 AM',
          duration: `${quiz.duration || 60} minutes`,
          status: quiz.is_active ? 'live' : quiz.is_completed ? 'completed' : 'upcoming',
          score: quiz.score || null,
          totalQuestions: quiz.questions?.length || 0
        }))
        
        setExams(transformedExams)
      } catch (error) {
        console.error('Error fetching exams:', error)
        toast.error('Failed to load exams')
        setExams([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  const filteredExams = filter === 'all' 
    ? exams 
    : exams.filter(exam => exam.status === filter)

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading exams...</p>
          </div>
        )}

        {/* Exams Grid */}
        {!loading && (
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
                  <span>{new Date(exam.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  <span>{exam.time} • {exam.duration}</span>
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
                      {exam.score}/{exam.totalQuestions}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(exam.score / exam.totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {exam.status === 'live' ? (
                <button 
                  onClick={() => navigate(`/student/exam/${exam.id}`)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiPlay className="w-4 h-4" />
                  Join Now
                </button>
              ) : exam.status === 'upcoming' ? (
                <button className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-medium cursor-not-allowed">
                  Not Available Yet
                </button>
              ) : (
                <button 
                  onClick={() => navigate(`/student/exam/${exam.id}/result`)}
                  className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  View Results
                </button>
              )}
            </motion.div>
          ))}
        </div>
        )}

        {!loading && filteredExams.length === 0 && (
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
