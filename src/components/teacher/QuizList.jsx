import { useState, useEffect } from 'react'
import { quizAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaPlus, FaEye, FaTrash, FaCode } from 'react-icons/fa'

const QuizList = ({ onCreateNew }) => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll()
      setQuizzes(response.data)
    } catch (error) {
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      await quizAPI.delete(id)
      toast.success('Quiz deleted')
      fetchQuizzes()
    } catch (error) {
      toast.error('Failed to delete quiz')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading quizzes...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Quizzes</h2>
        <button onClick={onCreateNew} className="btn-primary flex items-center gap-2">
          <FaPlus />
          Create New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No quizzes yet</p>
          <button onClick={onCreateNew} className="btn-primary flex items-center gap-2 mx-auto">
            <FaPlus />
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="card">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-semibold">{quiz.questions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">{quiz.duration} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Code:</span>
                  <span className="font-mono font-semibold text-primary-600 flex items-center gap-1">
                    <FaCode />
                    {quiz.code}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
                  <FaEye />
                  View
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizList
