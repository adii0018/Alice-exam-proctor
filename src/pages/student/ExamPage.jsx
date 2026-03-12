import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExamTopBar from '../../components/exam/ExamTopBar';
import QuestionPanel from '../../components/exam/QuestionPanel';
import ProctorPanel from '../../components/exam/ProctorPanel';
import WarningModal from '../../components/exam/WarningModal';
import ExitConfirmModal from '../../components/exam/ExitConfirmModal';
import RulesModal from '../../components/exam/RulesModal';
import MultiFaceWarning from '../../components/exam/MultiFaceWarning';
import GazeWarning from '../../components/exam/GazeWarning';
import useFaceDetection from '../../hooks/useFaceDetection';
import useGazeDetection from '../../hooks/useGazeDetection';
import soundManager from '../../utils/soundEffects';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  // Exam state
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(3600); // seconds
  
  // Proctoring state
  const [violations, setViolations] = useState([]);
  const [faceStatus, setFaceStatus] = useState('detected');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showMultiFaceWarning, setShowMultiFaceWarning] = useState(false);
  const [currentFaceCount, setCurrentFaceCount] = useState(0);
  
  // Gaze detection state
  const [showGazeWarning, setShowGazeWarning] = useState(false);
  const [gazeDirection, setGazeDirection] = useState('center');
  const [gazeDuration, setGazeDuration] = useState(0);
  
  // UI state
  const [showWarning, setShowWarning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  const wsRef = useRef(null);
  const videoRef = useRef(null);

  // Face detection integration
  const { 
    isInitialized: faceDetectionReady, 
    currentFaceCount: detectedFaces,
    error: faceDetectionError,
    detectionEngine
  } = useFaceDetection({
    videoRef,
    enabled: !!exam,
    engine: 'auto', // 'auto' will try OpenCV first, then fallback to face-api.js
    config: {
      detectionIntervalMs: 1000,
      violationThresholdSeconds: 3,
      maxFacesAllowed: 1
    },
    onFaceCountChange: (count) => {
      setCurrentFaceCount(count);
      
      // Update face status
      if (count === 0) {
        setFaceStatus('none');
        soundManager.playWarning();
      } else if (count === 1) {
        setFaceStatus('detected');
        setShowMultiFaceWarning(false);
      } else {
        setFaceStatus('multiple');
        setShowMultiFaceWarning(true);
        soundManager.playMultiFaceAlert();
      }
    },
    onViolation: (violationData) => {
      handleFaceViolation(violationData);
    }
  });

  // Gaze detection integration
  const {
    isInitialized: gazeDetectionReady,
    isLookingAway,
    gazeDirection: currentGazeDirection,
    error: gazeDetectionError
  } = useGazeDetection({
    videoRef,
    enabled: !!exam,
    config: {
      detectionIntervalMs: 500,
      violationThresholdSeconds: 4,
      maxYawAngle: 25,
      maxPitchAngle: 20
    },
    onGazeChange: (gazeData) => {
      setShowGazeWarning(gazeData.isLookingAway);
      setGazeDirection(gazeData.direction);
      
      // Update duration for display
      if (gazeData.isLookingAway) {
        const state = gazeData.headPose;
        // Calculate approximate duration (will be updated by violation)
        setGazeDuration(prev => prev + 0.5);
      } else {
        setGazeDuration(0);
      }
    },
    onViolation: (violationData) => {
      handleGazeViolation(violationData);
    }
  });

  // Log detection engine being used
  useEffect(() => {
    if (detectionEngine) {
      console.log(`Face detection engine: ${detectionEngine}`);
      if (detectionEngine === 'opencv') {
        console.log('✓ Using OpenCV.js - Higher accuracy');
      } else {
        console.log('✓ Using face-api.js - Lightweight');
      }
    }
  }, [detectionEngine]);

  // Log gaze detection status
  useEffect(() => {
    if (gazeDetectionReady) {
      console.log('✓ Gaze detection active - monitoring student attention');
    }
  }, [gazeDetectionReady]);

  // Load exam data
  useEffect(() => {
    fetchExamData();
    requestFullscreen();
    
    return () => {
      cleanup();
    };
  }, [examId]);

  // Play exam start sound when exam loads
  useEffect(() => {
    if (exam && !loading) {
      soundManager.playExamStart();
    }
  }, [exam, loading]);

  // Setup proctoring after exam is loaded
  useEffect(() => {
    if (exam) {
      setupProctoring();
    }
  }, [exam]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      console.log('Fetching exam:', examId);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`http://localhost:8000/api/quizzes/${examId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch exam');
      }
      
      const data = await response.json();
      console.log('Exam data loaded:', data);
      
      // Validate data
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions found in this exam');
      }
      
      // Transform questions to add IDs and option IDs
      const transformedQuestions = data.questions.map((q, qIndex) => ({
        id: qIndex,
        text: q.text,
        correctAnswer: q.correctAnswer,
        options: q.options.map((opt, optIndex) => ({
          id: optIndex,
          text: opt
        }))
      }));
      
      setExam({
        ...data,
        questions: transformedQuestions
      });
      setTimeRemaining(data.duration * 60);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load exam:', error);
      setError(error.message);
      setLoading(false);
      showWarningToast('Failed to load exam: ' + error.message);
      
      // Redirect back to dashboard after 5 seconds
      setTimeout(() => {
        navigate('/student');
      }, 5000);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!exam || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        // Play tick sound in last 10 seconds
        if (prev <= 10 && prev > 1) {
          soundManager.playTick();
        }
        
        if (prev <= 1) {
          soundManager.playExamEnd();
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [exam, timeRemaining]);

  // Fullscreen enforcement
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {
        showWarningToast('Please enable fullscreen mode');
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        soundManager.playWarning();
        addViolation('Exited fullscreen mode');
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        soundManager.playWarning();
        setTabSwitchCount(prev => prev + 1);
        addViolation('Tab switched or window minimized');
        showWarningToast('Warning: Tab switching detected');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Prevent context menu and copy/paste
  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    const preventCopy = (e) => {
      e.preventDefault();
      showWarningToast('Copy/paste is disabled during exam');
    };
    
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
    };
  }, []);

  // Setup proctoring (WebRTC + WebSocket)
  const setupProctoring = async () => {
    try {
      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate face detection (since we don't have actual AI yet)
      // In production, this would be replaced with actual face detection
      setFaceStatus('detected');
      
      // Connect to WebSocket for AI monitoring (optional - will fail gracefully if not available)
      try {
        const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
        wsRef.current = new WebSocket(`${wsBaseUrl}/proctor/${examId}/`);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connected for proctoring');
        };
        
        wsRef.current.onerror = (error) => {
          console.warn('WebSocket connection failed (proctoring will work in offline mode):', error);
        };
        
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleProctoringEvent(data);
        };
      } catch (wsError) {
        console.warn('WebSocket not available, continuing without real-time AI monitoring');
      }
      
    } catch (error) {
      console.error('Proctoring setup failed:', error);
      showWarningToast('Camera access required for exam');
      // Set face status to none if camera fails
      setFaceStatus('none');
    }
  };

  const handleProctoringEvent = (data) => {
    if (data.type === 'face_detection') {
      setFaceStatus(data.status);
      if (data.status !== 'detected') {
        addViolation(data.message);
      }
    }
    
    if (data.type === 'violation') {
      addViolation(data.message);
      showWarningToast(data.message);
    }
  };

  const addViolation = (message) => {
    const violation = {
      timestamp: new Date().toISOString(),
      message,
      questionNumber: currentQuestion + 1
    };
    
    setViolations(prev => [...prev, violation]);
    
    // Play violation alert sound
    soundManager.playViolationAlert();
    
    // Check if approaching limit
    if (violations.length >= 8) {
      showWarningToast('Warning: Approaching violation limit. Exam may be auto-submitted.');
    }
    
    // Auto-submit at 10 violations
    if (violations.length >= 10) {
      handleAutoSubmit('Maximum violations reached');
    }
  };

  const handleFaceViolation = async (violationData) => {
    console.log('Face violation detected:', violationData);
    
    // Add to local violations
    addViolation(violationData.message);
    
    // Show warning
    showWarningToast(`Warning: ${violationData.message}`);
    
    // Send to backend via REST API
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/violations/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quiz_id: examId,
          violation_type: violationData.type,
          face_count: violationData.faceCount,
          severity: violationData.severity,
          metadata: {
            message: violationData.message,
            timestamp: violationData.timestamp
          }
        })
      });
    } catch (error) {
      console.error('Failed to log violation to backend:', error);
    }
    
    // Send via WebSocket for real-time alert
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        wsRef.current.send(JSON.stringify({
          type: 'violation_alert',
          student_id: user._id || user.id,
          violation_type: violationData.type,
          face_count: violationData.faceCount,
          severity: violationData.severity,
          metadata: {
            message: violationData.message,
            timestamp: violationData.timestamp
          }
        }));
      } catch (error) {
        console.error('Failed to send WebSocket violation:', error);
      }
    }
  };

  const handleGazeViolation = async (violationData) => {
    console.log('Gaze violation detected:', violationData);
    
    // Add to local violations
    const message = `Looking away ${violationData.direction} for ${violationData.duration}s`;
    addViolation(message);
    
    // Show warning toast
    showWarningToast(`Warning: ${message}`);
    
    // Update gaze duration for display
    setGazeDuration(violationData.duration);
    
    // Send to backend via REST API
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/violations/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quiz_id: examId,
          violation_type: 'LOOKING_AWAY',
          severity: violationData.severity,
          metadata: {
            direction: violationData.direction,
            duration: violationData.duration,
            headPose: violationData.metadata?.headPose,
            timestamp: violationData.timestamp
          }
        })
      });
    } catch (error) {
      console.error('Failed to log gaze violation to backend:', error);
    }
    
    // Send via WebSocket for real-time alert
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        wsRef.current.send(JSON.stringify({
          type: 'violation_alert',
          student_id: user._id || user.id,
          violation_type: 'LOOKING_AWAY',
          severity: violationData.severity,
          metadata: {
            direction: violationData.direction,
            duration: violationData.duration,
            headPose: violationData.metadata?.headPose,
            timestamp: violationData.timestamp
          }
        }));
      } catch (error) {
        console.error('Failed to send WebSocket gaze violation:', error);
      }
    }
  };

  const showWarningToast = (message) => {
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 4000);
  };

  // Answer handling
  const handleAnswerSelect = (questionId, optionId) => {
    soundManager.playClick();
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleMarkForReview = (questionId) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Navigation
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          if (exam?.questions[currentQuestion]) {
            const optionIndex = parseInt(e.key) - 1;
            const question = exam.questions[currentQuestion];
            if (question.options[optionIndex]) {
              handleAnswerSelect(question.id, question.options[optionIndex].id);
            }
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, exam]);

  // Submit exam
  const handleSubmitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      soundManager.playExamEnd();
      const token = localStorage.getItem('token');
      
      // Transform answers to backend format (question index -> option text)
      const transformedAnswers = {};
      let correctCount = 0;
      let wrongCount = 0;
      
      Object.keys(answers).forEach(questionId => {
        const question = exam.questions[questionId];
        const optionId = answers[questionId];
        const selectedOption = question.options[optionId];
        transformedAnswers[questionId] = selectedOption.text;
        
        // Check if answer is correct
        if (selectedOption.text === question.correctAnswer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      });
      
      // Calculate result
      const totalQuestions = exam.questions.length;
      const score = correctCount;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const timeSpentSeconds = (exam.duration * 60) - timeRemaining;
      const minutes = Math.floor(timeSpentSeconds / 60);
      const seconds = timeSpentSeconds % 60;
      const timeTaken = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Store result in localStorage
      const resultData = {
        score,
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        timeTaken,
        percentage,
        violations: violations.map(v => ({
          type: v.message || 'Violation',
          timestamp: new Date(v.timestamp).toLocaleTimeString(),
          severity: violations.length > 7 ? 'high' : violations.length > 3 ? 'medium' : 'low'
        }))
      };
      
      localStorage.setItem(`exam_result_${examId}`, JSON.stringify(resultData));
      
      // Submit to backend
      await fetch(`http://localhost:8000/api/quizzes/${examId}/submit/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          answers: transformedAnswers,
          violations,
          timeSpent: timeSpentSeconds
        })
      });
      
      cleanup();
      navigate(`/student/exam/${examId}/result`);
    } catch (error) {
      console.error('Submit failed:', error);
      showWarningToast('Failed to submit exam. Please try again.');
    }
  };

  const handleAutoSubmit = async (reason = 'Time expired') => {
    await handleConfirmSubmit();
  };

  const cleanup = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Ignore errors when exiting fullscreen
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-800">Loading exam...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we prepare your exam</p>
        </div>
      </div>
    );
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/student')}
              className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">Redirecting to dashboard in 5 seconds...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-800">Loading exam...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we prepare your exam</p>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <ExamTopBar
        examName={exam.title}
        timeRemaining={timeRemaining}
        violationCount={violations.length}
        onSubmit={handleSubmitClick}
        onShowRules={() => setShowRules(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Panel - Desktop 70% */}
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
            onQuestionSelect={goToQuestion}
            currentQuestion={currentQuestion}
          />
        </div>
        
        {/* Proctor Panel - Desktop 30% */}
        <div className="hidden lg:block lg:w-[30%] border-l border-gray-200 bg-white">
          <ProctorPanel
            videoRef={videoRef}
            faceStatus={faceStatus}
            violationCount={violations.length}
            tabSwitchCount={tabSwitchCount}
            faceCount={currentFaceCount}
          />
        </div>
      </div>
      
      {/* Warning Toast */}
      <AnimatePresence>
        {showWarning && (
          <WarningModal
            message={warningMessage}
            onClose={() => setShowWarning(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Multi-Face Warning */}
      <MultiFaceWarning 
        faceCount={currentFaceCount}
        isVisible={showMultiFaceWarning}
      />
      
      {/* Gaze Warning */}
      <GazeWarning
        isVisible={showGazeWarning}
        direction={gazeDirection}
        duration={Math.round(gazeDuration)}
      />
      
      {/* Exit Confirmation */}
      {showExitConfirm && (
        <ExitConfirmModal
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowExitConfirm(false)}
          answeredCount={Object.keys(answers).length}
          totalQuestions={exam.questions.length}
        />
      )}
      
      {/* Rules Modal */}
      {showRules && (
        <RulesModal
          rules={exam.rules || []}
          onClose={() => setShowRules(false)}
        />
      )}
    </div>
  );
};

export default ExamPage;
