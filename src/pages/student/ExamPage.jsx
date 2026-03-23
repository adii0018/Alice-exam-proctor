import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ExamTopBar from '../../components/exam/ExamTopBar';
import QuestionPanel from '../../components/exam/QuestionPanel';
import ProctorPanel from '../../components/exam/ProctorPanel';
import WarningModal from '../../components/exam/WarningModal';
import ExitConfirmModal from '../../components/exam/ExitConfirmModal';
import RulesModal from '../../components/exam/RulesModal';
import MultiFaceWarning from '../../components/exam/MultiFaceWarning';
import GazeWarning from '../../components/exam/GazeWarning';
import useProctoring, { Decision } from '../../hooks/useProctoring';
import soundManager from '../../utils/soundEffects';
import { flagAPI } from '../../utils/api';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(3600);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMultiFaceWarning, setShowMultiFaceWarning] = useState(false);
  const [showGazeWarning, setShowGazeWarning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const videoRef = useRef(null);
  const wsRef = useRef(null);

  // ── Proctoring ─────────────────────────────────────────────────────────
  const {
    isReady, faceCount, isLookingAway, gazeDirection,
    score, decision, tabSwitchCount, violations, getReport,
  } = useProctoring({
    videoRef,
    enabled: !!exam,
    onViolation: async (entry) => {
      soundManager.playViolationAlert();
      try {
        await flagAPI.create({
          quiz_id: examId,
          type: entry.type,
          severity: entry.severity,
          timestamp: entry.timestamp,
          metadata: entry,
        });
      } catch { /* non-blocking */ }

      // Also send via WebSocket for real-time teacher alert
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        wsRef.current.send(JSON.stringify({
          type: 'violation_alert',
          student_id: user._id || user.id,
          violation_type: entry.type,
          severity: entry.severity,
          metadata: entry,
        }));
      }
    },
  });

  // React to proctoring decisions
  useEffect(() => {
    if (decision === Decision.CHEATING) {
      showWarningToast('High risk activity detected. Your session is being recorded.');
    } else if (decision === Decision.SUSPECT) {
      showWarningToast('Suspicious activity detected. Please focus on your exam.');
    }
  }, [decision]);

  // Update multi-face warning
  useEffect(() => {
    if (faceCount === 0) {
      soundManager.playWarning();
    } else if (faceCount > 1) {
      setShowMultiFaceWarning(true);
      soundManager.playMultiFaceAlert();
    } else {
      setShowMultiFaceWarning(false);
    }
  }, [faceCount]);

  // Update gaze warning
  useEffect(() => {
    setShowGazeWarning(isLookingAway);
  }, [isLookingAway]);

  // ── Load exam ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchExamData();
    requestFullscreen();
    return () => cleanup();
  }, [examId]);

  useEffect(() => {
    if (exam && !loading) soundManager.playExamStart();
  }, [exam, loading]);

  useEffect(() => {
    if (exam) setupCamera();
  }, [exam]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/quizzes/${examId}/`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to fetch exam');
      }
      const data = await response.json();
      if (!data.questions?.length) throw new Error('No questions found in this exam');

      const transformedQuestions = data.questions.map((q, i) => ({
        id: i,
        text: q.text,
        correctAnswer: q.correctAnswer,
        options: q.options.map((opt, j) => ({ id: j, text: opt }))
      }));

      setExam({ ...data, questions: transformedQuestions });
      setTimeRemaining(data.duration * 60);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setTimeout(() => navigate('/student'), 5000);
    }
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;

      // WebSocket for real-time teacher alerts (optional, fails gracefully)
      try {
        const wsBase = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
        wsRef.current = new WebSocket(`${wsBase}/proctor/${examId}/`);
        wsRef.current.onerror = () => {};
      } catch { /* no WS, continue */ }
    } catch {
      showWarningToast('Camera access required for exam');
    }
  };

  // ── Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!exam || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 10 && prev > 1) soundManager.playTick();
        if (prev <= 1) { soundManager.playExamEnd(); handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam]);

  // ── Fullscreen ─────────────────────────────────────────────────────────
  const requestFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        soundManager.playWarning();
        showWarningToast('Warning: Fullscreen mode exited');
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Tab switch ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        soundManager.playWarning();
        showWarningToast('Warning: Tab switching detected');
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ── Copy/paste prevention ──────────────────────────────────────────────
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('copy', prevent);
    document.addEventListener('cut', prevent);
    document.addEventListener('paste', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('copy', prevent);
      document.removeEventListener('cut', prevent);
      document.removeEventListener('paste', prevent);
    };
  }, []);

  // ── Keyboard nav ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
      else if (['1','2','3','4'].includes(e.key) && exam?.questions[currentQuestion]) {
        const opt = exam.questions[currentQuestion].options[parseInt(e.key) - 1];
        if (opt) handleAnswerSelect(exam.questions[currentQuestion].id, opt.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentQuestion, exam]);

  const showWarningToast = (msg) => {
    setWarningMessage(msg);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 4000);
  };

  const handleAnswerSelect = (questionId, optionId) => {
    soundManager.playClick();
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleMarkForReview = (questionId) => {
    setMarkedForReview(prev => {
      const s = new Set(prev);
      s.has(questionId) ? s.delete(questionId) : s.add(questionId);
      return s;
    });
  };

  const handleNext = () => { if (currentQuestion < exam.questions.length - 1) setCurrentQuestion(p => p + 1); };
  const handlePrevious = () => { if (currentQuestion > 0) setCurrentQuestion(p => p - 1); };

  const handleConfirmSubmit = async () => {
    try {
      soundManager.playExamEnd();
      const token = localStorage.getItem('token');

      let correctCount = 0, wrongCount = 0;
      const transformedAnswers = {};

      Object.keys(answers).forEach(qId => {
        const question = exam.questions[qId];
        const selectedOption = question.options[answers[qId]];
        transformedAnswers[qId] = selectedOption.text;
        if (selectedOption.text === question.correctAnswer) correctCount++;
        else wrongCount++;
      });

      const totalQuestions = exam.questions.length;
      const timeSpentSeconds = (exam.duration * 60) - timeRemaining;
      const timeTaken = `${Math.floor(timeSpentSeconds / 60)}:${String(timeSpentSeconds % 60).padStart(2, '0')}`;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const proctoringReport = getReport();

      // Submit to backend
      const res = await fetch(`http://localhost:8000/api/quizzes/${examId}/submit/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: transformedAnswers, proctoringReport, timeSpent: timeSpentSeconds })
      });

      const resultData = {
        score: correctCount,
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        timeTaken,
        percentage,
        violations: violations.map(v => ({
          type: v.type,
          timestamp: new Date(v.timestamp).toLocaleTimeString(),
          severity: v.severity,
        })),
        proctoringScore: score,
        proctoringDecision: decision,
      };

      // Persist result so ExamResultPage can read it after refresh
      localStorage.setItem(`exam_result_${examId}`, JSON.stringify(resultData));

      cleanup();
      navigate(`/student/exam/${examId}/result`);
    } catch (err) {
      showWarningToast('Failed to submit exam. Please try again.');
    }
  };

  const handleAutoSubmit = () => handleConfirmSubmit();

  const cleanup = () => {
    wsRef.current?.close();
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4" />
          <p className="text-xl font-semibold text-gray-800">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 mb-3">Try Again</button>
          <button onClick={() => navigate('/student')} className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300">Back to Dashboard</button>
          <p className="text-xs text-gray-500 mt-4">Redirecting in 5 seconds...</p>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const currentQ = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ExamTopBar
        examName={exam.title}
        timeRemaining={timeRemaining}
        violationCount={violations.length}
        onSubmit={() => setShowExitConfirm(true)}
        onShowRules={() => setShowRules(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 lg:w-[70%] overflow-y-auto">
          <QuestionPanel
            question={currentQ}
            questionNumber={currentQuestion + 1}
            totalQuestions={exam.questions.length}
            selectedAnswer={answers[currentQ.id]}
            isMarkedForReview={markedForReview.has(currentQ.id)}
            onAnswerSelect={(optionId) => handleAnswerSelect(currentQ.id, optionId)}
            onMarkForReview={() => handleMarkForReview(currentQ.id)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentQuestion < exam.questions.length - 1}
            canGoPrevious={currentQuestion > 0}
            allQuestions={exam.questions}
            answers={answers}
            markedForReview={markedForReview}
            onQuestionSelect={(i) => setCurrentQuestion(i)}
            currentQuestion={currentQuestion}
          />
        </div>

        <div className="hidden lg:block lg:w-[30%] border-l border-gray-200 bg-white">
          <ProctorPanel
            videoRef={videoRef}
            faceStatus={faceCount === 0 ? 'none' : faceCount > 1 ? 'multiple' : 'detected'}
            violationCount={violations.length}
            tabSwitchCount={tabSwitchCount}
            faceCount={faceCount}
          />
        </div>
      </div>

      <AnimatePresence>
        {showWarning && <WarningModal message={warningMessage} onClose={() => setShowWarning(false)} />}
      </AnimatePresence>

      <MultiFaceWarning faceCount={faceCount} isVisible={showMultiFaceWarning} />
      <GazeWarning isVisible={showGazeWarning} direction={gazeDirection} duration={0} />

      {showExitConfirm && (
        <ExitConfirmModal
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowExitConfirm(false)}
          answeredCount={Object.keys(answers).length}
          totalQuestions={exam.questions.length}
        />
      )}

      {showRules && <RulesModal rules={exam.rules || []} onClose={() => setShowRules(false)} />}
    </div>
  );
};

export default ExamPage;
