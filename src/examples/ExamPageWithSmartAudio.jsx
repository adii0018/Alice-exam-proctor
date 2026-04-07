/**
 * ExamPageWithSmartAudio — Example integration of enhanced audio detection
 * 
 * Shows how to integrate SmartAudioDetection with existing exam proctoring
 * This is a reference implementation - adapt to your existing ExamPage component
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Existing hooks and components
import useProctoring from '../hooks/useProctoring';
import useSmartAudioDetection from '../hooks/useSmartAudioDetection';
import AudioCalibrationModal from '../components/exam/AudioCalibrationModal';
import AudioRiskIndicator from '../components/exam/AudioRiskIndicator';

// Your existing exam components
import ExamTopBar from '../components/exam/ExamTopBar';
import QuestionPanel from '../components/exam/QuestionPanel';
import ProctorPanel from '../components/exam/ProctorPanel';

const ExamPageWithSmartAudio = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  // Exam state
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  
  // Audio calibration state
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [audioCalibrationComplete, setAudioCalibrationComplete] = useState(false);

  // Existing proctoring hook
  const {
    isReady: proctoringReady,
    faceCount,
    isLookingAway,
    score: proctoringScore,
    violations: proctoringViolations,
    getReport
  } = useProctoring({
    videoRef,
    enabled: isExamStarted,
    onViolation: handleProctoringViolation
  });

  // NEW: Enhanced audio detection hook
  const {
    isCalibrating,
    calibrationProgress,
    isCalibrated,
    isMonitoring,
    riskScore,
    riskLevel,
    startCalibration,
    startMonitoring,
    stopMonitoring,
    resetRiskScore,
    isReady: audioReady
  } = useSmartAudioDetection({
    enabled: true,
    onViolation: handleAudioViolation,
    autoStart: true // Automatically start monitoring after calibration
  });

  // Handle proctoring violations (existing)
  function handleProctoringViolation(violation) {
    console.log('[Exam] Proctoring violation:', violation);
    
    // Send to backend via your existing API
    // violationAPI.create({ examId, studentId, ...violation });
    
    // Show appropriate warning
    if (violation.type === 'MULTIPLE_FACES') {
      toast.error('Multiple faces detected! Please ensure only you are visible.');
    } else if (violation.type === 'LOOKING_AWAY') {
      toast.warning('Please keep your eyes on the screen.');
    }
  }

  // NEW: Handle audio violations
  function handleAudioViolation(violation) {
    console.log('[Exam] Audio violation:', violation);
    
    // Send to backend with enhanced data
    const audioViolationData = {
      examId,
      studentId: getCurrentStudentId(), // Your function to get student ID
      type: 'AUDIO_ANOMALY',
      severity: violation.severity,
      metadata: {
        volume: violation.volume,
        voicePercent: violation.voicePercent,
        voiceDurationMs: violation.voiceDurationMs,
        riskScore: violation.riskScore,
        dynamicThreshold: violation.dynamicThreshold
      },
      timestamp: violation.timestamp
    };
    
    // Send to your violation API
    // violationAPI.create(audioViolationData);
    
    // Progressive warnings are handled by the hook automatically
    // Additional custom logic can go here
  }

  // Initialize exam
  useEffect(() => {
    loadExamData();
  }, [examId]);

  // Show calibration modal before exam starts
  useEffect(() => {
    if (examData && !isExamStarted && !audioCalibrationComplete) {
      setShowCalibrationModal(true);
    }
  }, [examData, isExamStarted, audioCalibrationComplete]);

  const loadExamData = async () => {
    try {
      // Load your exam data
      // const data = await examAPI.getById(examId);
      // setExamData(data);
      // setTimeRemaining(data.duration * 60); // Convert minutes to seconds
      
      // Mock data for example
      setExamData({
        id: examId,
        title: 'Sample Exam',
        duration: 60,
        questions: [
          { id: 1, text: 'What is 2+2?', options: ['3', '4', '5', '6'] }
        ]
      });
      setTimeRemaining(60 * 60); // 60 minutes
    } catch (error) {
      console.error('Failed to load exam:', error);
      toast.error('Failed to load exam data');
      navigate('/student/dashboard');
    }
  };

  const getCurrentStudentId = () => {
    // Your logic to get current student ID
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user._id;
  };

  const handleCalibrationStart = async () => {
    const success = await startCalibration();
    if (!success) {
      toast.error('Audio calibration failed. Proceeding with default settings.');
      setAudioCalibrationComplete(true);
      setShowCalibrationModal(false);
    }
  };

  const handleCalibrationComplete = () => {
    setAudioCalibrationComplete(true);
    setShowCalibrationModal(false);
    toast.success('Ready to start exam!');
  };

  const startExam = async () => {
    try {
      // Setup camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false // Audio is handled by SmartAudioDetection
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Reset audio risk score for new exam
      resetRiskScore();
      
      // Start exam
      setIsExamStarted(true);
      
      // Audio monitoring starts automatically due to autoStart: true
      toast.success('Exam started! AI monitoring is now active.');
      
    } catch (error) {
      console.error('Failed to start exam:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const submitExam = async () => {
    try {
      // Stop monitoring
      stopMonitoring();
      
      // Get comprehensive report
      const proctoringReport = getReport();
      const audioState = {
        finalRiskScore: riskScore,
        riskLevel: riskLevel
      };
      
      // Submit exam with enhanced proctoring data
      const examSubmission = {
        examId,
        studentId: getCurrentStudentId(),
        answers,
        proctoringReport,
        audioReport: audioState,
        submittedAt: new Date().toISOString()
      };
      
      // await examAPI.submit(examSubmission);
      console.log('Exam submitted with enhanced proctoring data:', examSubmission);
      
      toast.success('Exam submitted successfully!');
      navigate('/student/dashboard');
      
    } catch (error) {
      console.error('Failed to submit exam:', error);
      toast.error('Failed to submit exam');
    }
  };

  if (!examData) {
    return <div className="flex items-center justify-center min-h-screen">Loading exam...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Audio Calibration Modal */}
      <AudioCalibrationModal
        isOpen={showCalibrationModal}
        isCalibrating={isCalibrating}
        calibrationProgress={calibrationProgress}
        isCalibrated={isCalibrated}
        onStartCalibration={handleCalibrationStart}
        onClose={() => {
          setShowCalibrationModal(false);
          setAudioCalibrationComplete(true);
        }}
        onContinue={handleCalibrationComplete}
      />

      {/* Exam Interface */}
      {isExamStarted ? (
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <ExamTopBar
              examTitle={examData.title}
              timeRemaining={timeRemaining}
              currentQuestion={currentQuestion + 1}
              totalQuestions={examData.questions.length}
              onSubmit={submitExam}
            />

            {/* Question Panel */}
            <div className="flex-1 p-6">
              <QuestionPanel
                question={examData.questions[currentQuestion]}
                answer={answers[currentQuestion]}
                onAnswerChange={(answer) => 
                  setAnswers(prev => ({ ...prev, [currentQuestion]: answer }))
                }
                onNext={() => setCurrentQuestion(prev => 
                  Math.min(prev + 1, examData.questions.length - 1)
                )}
                onPrevious={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
              />
            </div>
          </div>

          {/* Proctoring Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Camera Feed */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Camera Feed</h3>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-32 bg-black rounded-lg object-cover"
              />
            </div>

            {/* NEW: Audio Risk Indicator */}
            <AudioRiskIndicator
              isMonitoring={isMonitoring}
              riskScore={riskScore}
              riskLevel={riskLevel}
            />

            {/* Existing Proctoring Panel */}
            <ProctorPanel
              faceCount={faceCount}
              isLookingAway={isLookingAway}
              score={proctoringScore}
              violations={proctoringViolations}
            />

            {/* System Status */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">System Status</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Camera:</span>
                  <span className={proctoringReady ? 'text-green-600' : 'text-red-600'}>
                    {proctoringReady ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Monitor:</span>
                  <span className={isMonitoring ? 'text-green-600' : 'text-red-600'}>
                    {isMonitoring ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Calibrated:</span>
                  <span className={isCalibrated ? 'text-green-600' : 'text-yellow-600'}>
                    {isCalibrated ? 'Yes' : 'Default'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pre-Exam Setup */
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h1 className="text-2xl font-bold text-center mb-6">{examData.title}</h1>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span>Duration:</span>
                <span className="font-medium">{examData.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span>Questions:</span>
                <span className="font-medium">{examData.questions.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span>Audio Calibrated:</span>
                <span className={`font-medium ${audioCalibrationComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                  {audioCalibrationComplete ? 'Yes' : 'Pending'}
                </span>
              </div>
            </div>

            <button
              onClick={audioCalibrationComplete ? startExam : () => setShowCalibrationModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {audioCalibrationComplete ? 'Start Exam' : 'Setup Audio & Start'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPageWithSmartAudio;