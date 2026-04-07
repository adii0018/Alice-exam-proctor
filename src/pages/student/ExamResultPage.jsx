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

      // Try localStorage first (freshly submitted result)
      const stored = localStorage.getItem(`exam_result_${examId}`);
      if (stored) {
        const storedResult = JSON.parse(stored);
        setResult(storedResult);
        setQuiz({ _id: examId, title: storedResult.quizTitle || 'Exam Result', questions: [] });
      }

      // Fetch quiz details (needed for title + fallback reconstruction)
      const quizRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/quizzes/${examId}/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!quizRes.ok) throw new Error('Failed to fetch quiz details');
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // Try reconstructing from quiz submission list (if API includes it)
      const submission = (quizData.submissions || []).find((s) =>
        (s.student_id === studentId) || (s.studentId === studentId) || (s.student?._id === studentId)
      );
      if (submission) {
        const totalQuestions = quizData.questions?.length || submission.totalQuestions || submission.total_questions || 0;
        const submittedAnswers = submission.answers || {};
        let correctCount = 0;

        if (Array.isArray(quizData.questions) && quizData.questions.length > 0) {
          for (const q of quizData.questions) {
            const qId = String(q._id || q.id || '');
            const submitted = submittedAnswers[qId];
            const correct = q.correctAnswer;
            const submittedNum = Number(submitted);
            const correctNum = Number(correct);
            const isIndexMatch = Number.isFinite(submittedNum) && Number.isFinite(correctNum) && submittedNum === correctNum;
            const isTextMatch = typeof submitted === 'string' && submitted === correct;
            if (qId && (isIndexMatch || isTextMatch)) {
              correctCount += 1;
            }
          }
        }

        const submissionScore = Number.isFinite(Number(submission.score)) ? Number(submission.score) : null;
        const score = Number.isFinite(Number(submission.correctAnswers))
          ? Number(submission.correctAnswers)
          : Number.isFinite(Number(submission.correct_answers))
          ? Number(submission.correct_answers)
          : correctCount;
        const percentage = Number.isFinite(Number(submission.percentage))
          ? Number(submission.percentage)
          : (submissionScore !== null ? Math.round(submissionScore) : (totalQuestions ? Math.round((score / totalQuestions) * 100) : 0));
        const timeSpentSeconds = submission.timeSpent ?? submission.time_spent ?? 0;
        const timeTaken = timeSpentSeconds
          ? `${Math.floor(timeSpentSeconds / 60)}:${String(timeSpentSeconds % 60).padStart(2, '0')}`
          : 'N/A';

        setResult({
          score,
          totalQuestions,
          correctAnswers: score,
          wrongAnswers: Math.max(0, totalQuestions - score),
          timeTaken,
          percentage,
          violations: [],
          proctoringScore: submission.proctoringReport?.score ?? 0,
          proctoringDecision: submission.proctoringReport?.decision ?? 'CLEAN',
          quizTitle: quizData.title,
          submittedAt: submission.submittedAt || submission.created_at || null,
        });
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
        // If only violations exist, keep proctoring trail but avoid fake marks.
        score: null,
        totalQuestions: quizData.questions?.length || 0,
        correctAnswers: null,
        wrongAnswers: null,
        timeTaken: 'N/A',
        percentage: null,
        violations: (violationsData.violations || []).map(v => ({
          type: v.violation_type,
          timestamp: new Date(v.timestamp).toLocaleTimeString(),
          severity: v.severity,
        })),
        quizTitle: quizData.title,
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
