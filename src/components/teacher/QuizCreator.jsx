import { useState, useEffect } from 'react'
import { quizAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaTimes, FaPlus, FaCheck, FaSave, FaArrowLeft, FaArrowRight, FaTrash, FaEdit } from 'react-icons/fa'

const QuizCreator = ({ onClose, editQuizId = null }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    duration: 30,
    max_students: 0,
    questions: []
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  })

  // Load quiz data if editing
  useEffect(() => {
    if (editQuizId) {
      loadQuizData();
    }
  }, [editQuizId]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getById(editQuizId);
      const quizData = response.data;
      setQuiz({
        title: quizData.title || '',
        description: quizData.description || '',
        duration: quizData.duration || 30,
        max_students: quizData.max_students ?? 0,
        questions: quizData.questions || []
      });
      toast.success('Quiz loaded for editing');
    } catch (error) {
      toast.error('Failed to load quiz data');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizInfoChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value })
  }

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, text: e.target.value })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(o => !o)) {
      toast.error('Please fill all fields')
      return
    }

    if (editingQuestionIndex !== null) {
      // Update existing question
      const newQuestions = [...quiz.questions]
      newQuestions[editingQuestionIndex] = currentQuestion
      setQuiz({ ...quiz, questions: newQuestions })
      setEditingQuestionIndex(null)
      toast.success('Question updated')
    } else {
      // Add new question
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, currentQuestion]
      })
      toast.success('Question added')
    }

    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    })
  }

  const editQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index])
    setEditingQuestionIndex(index)
    toast.info('Editing question...')
  }

  const cancelEdit = () => {
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    })
    setEditingQuestionIndex(null)
  }

  const removeQuestion = (index) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
    toast.success('Question removed');
  };

  const handleSubmit = async () => {
    if (quiz.questions.length === 0) {
      toast.error('Add at least one question')
      return
    }

    try {
      setLoading(true);
      if (editQuizId) {
        await quizAPI.update(editQuizId, quiz);
        toast.success('Quiz updated successfully!');
      } else {
        const response = await quizAPI.create(quiz);
        const quizCode = response.data.code;
        toast.success(
          <div className="flex items-center gap-2">
            <span>Quiz created! Code: <strong>{quizCode}</strong></span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(quizCode);
                toast.success('Code copied!');
              }}
              className="px-2 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600"
            >
              Copy
            </button>
          </div>,
          { duration: 5000 }
        );
      }
      onClose();
    } catch (error) {
      toast.error(editQuizId ? 'Failed to update quiz' : 'Failed to create quiz');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {editQuizId ? 'Loading quiz data...' : 'Processing...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {editQuizId ? 'Edit Quiz - Step 1' : 'Create New Quiz - Step 1'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Quiz Title</label>
              <input
                type="text"
                name="title"
                value={quiz.title}
                onChange={handleQuizInfoChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                name="description"
                value={quiz.description}
                onChange={handleQuizInfoChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={quiz.duration}
                onChange={handleQuizInfoChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min={5}
                max={180}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Max Students
                <span className="ml-2 text-xs text-gray-400 font-normal">(0 = Unlimited)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="max_students"
                  value={quiz.max_students}
                  onChange={handleQuizInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  min={0}
                  max={9999}
                  placeholder="0 (Unlimited)"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {quiz.max_students > 0
                  ? `⚠️ Sirf ${quiz.max_students} students yeh quiz de sakte hain`
                  : '✅ Koi bhi student join kar sakta hai (unlimited)'}
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <FaTimes />
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!quiz.title}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next: Add Questions
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {editQuizId ? 'Edit Questions' : 'Add Questions'} ({quiz.questions.length} added)
        </h2>

        {/* Show existing questions */}
        {quiz.questions.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Existing Questions:</h3>
            {quiz.questions.map((q, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-all ${
                  editingQuestionIndex === index 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {index + 1}. {q.text}
                    </p>
                    <div className="space-y-1">
                      {q.options.map((opt, optIndex) => (
                        <p key={optIndex} className={`text-sm ${optIndex === q.correctAnswer ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          {String.fromCharCode(65 + optIndex)}. {opt} {optIndex === q.correctAnswer && '✓'}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => editQuestion(index)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit question"
                      disabled={editingQuestionIndex !== null && editingQuestionIndex !== index}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove question"
                      disabled={editingQuestionIndex !== null}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {editingQuestionIndex !== null ? `Editing Question ${editingQuestionIndex + 1}:` : 'Add New Question:'}
            </h3>
            {editingQuestionIndex !== null && (
              <button
                onClick={cancelEdit}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <FaTimes className="w-3 h-3" />
                Cancel Edit
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Question</label>
            <input
              type="text"
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your question"
            />
          </div>

          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Option {index + 1}
                {index === currentQuestion.correctAnswer && (
                  <span className="text-green-600 dark:text-green-400 ml-2">✓ Correct</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                    index === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <button 
            onClick={addQuestion} 
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={!currentQuestion.text || currentQuestion.options.some(o => !o)}
          >
            {editingQuestionIndex !== null ? (
              <>
                <FaCheck />
                Update Question
              </>
            ) : (
              <>
                <FaPlus />
                Add Question
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setStep(1)} className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <FaArrowLeft />
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={quiz.questions.length === 0 || loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FaSave />
            {loading ? 'Saving...' : (editQuizId ? 'Update Quiz' : 'Create Quiz')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizCreator
