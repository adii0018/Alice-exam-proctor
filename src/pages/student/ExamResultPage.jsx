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

  useEffect(() => {
    fetchResult();
  }, [examId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch quiz details
      const quizResponse = await fetch(`http://localhost:8000/api/quizzes/${examId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const quizData = await quizResponse.json();
      setQuiz(quizData);

      // Get result from localStorage (set during exam submission)
      const storedResult = localStorage.getItem(`exam_result_${examId}`);
      
      if (storedResult) {
        const resultData = JSON.parse(storedResult);
        setResult(resultData);
      } else {
        // If no stored result, create a basic one
        setResult({
          score: 0,
          totalQuestions: quizData.questions?.length || 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          timeTaken: '0:00',
          percentage: 0,
          violations: []
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load result:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    // Clear stored result
    localStorage.removeItem(`exam_result_${examId}`);
    navigate('/student');
  };

  if (loading) {
    return <FullPageLoader message="Loading your results..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find results for this exam.</p>
          <button
            onClick={handleBackToDashboard}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizResult 
      result={result}
      quiz={quiz}
      onBackToDashboard={handleBackToDashboard}
    />
  );
};

export default ExamResultPage;
