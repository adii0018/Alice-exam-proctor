import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { quizAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ExamTable from '../../components/teacher/ExamTable';
import QuizCreator from '../../components/teacher/QuizCreator';
import TeacherLayout from '../../components/teacher/TeacherLayout';

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

  const exams = quizzes.map(quiz => ({
    id: quiz._id,
    name: quiz.title,
    code: quiz.code,
    status: quiz.status === 'active' ? 'Live' : 'Draft',
    date: new Date(quiz.createdAt).toLocaleString(),
    duration: `${quiz.duration} min`,
    students: quiz.submissions?.length || 0
  }));

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
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="Exams">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
      {showCreateModal ? (
        <QuizCreator onClose={handleCloseCreator} editQuizId={editingQuizId} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Management</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage your exams</p>
            </div>
            <button
              onClick={handleCreateExam}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Exam
            </button>
          </div>
          <ExamTable exams={exams} onAction={handleExamAction} />
        </>
      )}
      </motion.div>
    </TeacherLayout>
  );
}
