import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { quizAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ExamTable from '../../components/teacher/ExamTable';
import QuizCreator from '../../components/teacher/QuizCreator';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';

export default function Exams() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
    
    // Check for edit parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setEditingQuizId(editId);
      setShowCreateModal(true);
    }
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getAll();
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const exams = quizzes.map(quiz => {
    // Format date properly
    let formattedDate = 'Not scheduled';
    try {
      if (quiz.scheduled_date) {
        const date = new Date(quiz.scheduled_date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } else if (quiz.createdAt) {
        const date = new Date(quiz.createdAt);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
          });
        }
      }
    } catch (error) {
      console.error('Date formatting error:', error);
    }

    return {
      id: quiz._id,
      name: quiz.title,
      code: quiz.code,
      status: quiz.is_active ? 'Live' : quiz.status === 'completed' ? 'Completed' : 'Draft',
      date: formattedDate,
      duration: `${quiz.duration || 30} min`,
      students: quiz.submissions?.length || 0,
      is_active: quiz.is_active || false,
      totalQuestions: quiz.questions?.length || 0
    };
  });

  const handleExamAction = async (action, exam) => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete "${exam.name}"?`)) return;
      try {
        await quizAPI.delete(exam.id);
        toast.success('Exam deleted successfully');
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to delete exam');
        console.error('Delete error:', error);
      }
    } else if (action === 'view') {
      window.location.href = `/teacher/live-monitoring?exam=${exam.id}`;
    } else if (action === 'edit') {
      setEditingQuizId(exam.id);
      setShowCreateModal(true);
    } else if (action === 'start') {
      if (!confirm(`Start exam "${exam.name}"?`)) return;
      try {
        await quizAPI.update(exam.id, { status: 'active' });
        toast.success('Exam started successfully');
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to start exam');
      }
    } else if (action === 'end') {
      if (!confirm(`End exam "${exam.name}"?`)) return;
      try {
        await quizAPI.update(exam.id, { status: 'completed' });
        toast.success('Exam ended successfully');
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to end exam');
      }
    } else if (action === 'toggle_active') {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/quizzes/${exam.id}/toggle-active/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success(data.message);
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to toggle quiz status');
      }
    }
  };

  const handleCreateExam = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreator = () => {
    setShowCreateModal(false);
    setEditingQuizId(null);
    // Clear URL parameter
    window.history.replaceState({}, '', '/teacher/exams');
    fetchQuizzes();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ width: 48, height: 48, border: '3px solid #2ea043', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const { darkMode } = useTheme();

  return (
    <TeacherLayout title="Exams">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {showCreateModal ? (
        <QuizCreator onClose={handleCloseCreator} editQuizId={editingQuizId} />
      ) : (
        <>
          {/* Header Section */}
          <div className={`${darkMode ? 'bg-[#0d1117]' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} rounded-2xl p-8 border ${darkMode ? 'border-[#30363d]' : 'border-blue-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'} mb-2`}>
                  Exam Management
                </h2>
                <p className={`${darkMode ? 'text-[#8b949e]' : 'text-gray-600'} text-sm`}>
                  Create, manage, and monitor your exams
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateExam}
                className={`flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-[#2ea043] hover:bg-[#2c974b]' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white rounded-xl font-semibold shadow-lg transition-all`}
              >
                <Plus size={20} />
                Create New Exam
              </motion.button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className={`${darkMode ? 'bg-[#161b22]' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-[#8b949e]' : 'text-gray-500'} font-medium mb-1`}>Total Exams</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>{exams.length}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-[#388bfd]/10' : 'bg-blue-100'} flex items-center justify-center`}>
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-[#161b22]' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-[#8b949e]' : 'text-gray-500'} font-medium mb-1`}>Live Now</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-[#3fb950]' : 'text-green-600'}`}>
                      {exams.filter(e => e.status === 'Live').length}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-[#3fb950]/10' : 'bg-green-100'} flex items-center justify-center`}>
                    <span className="text-2xl">🔴</span>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-[#161b22]' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-[#8b949e]' : 'text-gray-500'} font-medium mb-1`}>Completed</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-[#58a6ff]' : 'text-blue-600'}`}>
                      {exams.filter(e => e.status === 'Completed').length}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-[#58a6ff]/10' : 'bg-blue-100'} flex items-center justify-center`}>
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-[#161b22]' : 'bg-white'} rounded-xl p-4 border ${darkMode ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-[#8b949e]' : 'text-gray-500'} font-medium mb-1`}>Total Students</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-[#bc8cff]' : 'text-purple-600'}`}>
                      {exams.reduce((sum, e) => sum + e.students, 0)}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-[#bc8cff]/10' : 'bg-purple-100'} flex items-center justify-center`}>
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ExamTable exams={exams} onAction={handleExamAction} />
        </>
      )}
      </motion.div>
    </TeacherLayout>
  );
}
