import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizResult from '../../components/student/QuizResult';
import FullPageLoader from '../../components/loaders/FullPageLoader';

const ExamResultPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchResult(); }, [examId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentId = user._id || user.id;

      // Fetch quiz details
      const quizRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/quizzes/${examId}/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!quizRes.ok) throw new Error('Failed to fetch quiz details');
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // Try localStorage first (freshly submitted result)
      const stored = localStorage.getItem(`exam_result_${examId}`);
      if (stored) {
        setResult(JSON.parse(stored));
        setLoading(false);
        return;
      }

      // Fallback: fetch violations from backend to reconstruct result
      const violationsRes = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/violations/?quiz_id=${examId}&student_id=${studentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const violationsData = violationsRes.ok ? await violationsRes.json() : { violations: [] };

      setResult({
        score: 0,
        totalQuestions: quizData.questions?.length || 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timeTaken: 'N/A',
        percentage: 0,
        violations: (violationsData.violations || []).map(v => ({
          type: v.violation_type,
          timestamp: new Date(v.timestamp).toLocaleTimeString(),
          severity: v.severity,
        })),
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    localStorage.removeItem(`exam_result_${examId}`);
    navigate('/student');
  };

  if (loading) return <FullPageLoader message="Loading your results..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={handleBackToDashboard} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find results for this exam.</p>
          <button onClick={handleBackToDashboard} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <QuizResult result={result} quiz={quiz} onBackToDashboard={handleBackToDashboard} />;
};

export default ExamResultPage;
