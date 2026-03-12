import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI, flagAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import LiveMonitorCard from '../../components/teacher/LiveMonitorCard';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { ViolationAlertContainer } from '../../components/teacher/ViolationAlert';
import useWebSocket from '../../hooks/useWebSocket';

export default function LiveMonitoring() {
  const [quizzes, setQuizzes] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeViolations, setRealtimeViolations] = useState([]);

  // Get teacher ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const teacherId = user._id || user.id;

  // WebSocket connection for real-time violation alerts
  const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  const { isConnected, sendMessage } = useWebSocket({
    url: `${wsBaseUrl}/teacher/monitor/${teacherId}/`,
    enabled: !!teacherId,
    onMessage: (data) => {
      console.log('WebSocket message received:', data);
      
      if (data.type === 'VIOLATION_ALERT') {
        // Add new violation to alerts
        const violation = {
          ...data.violation,
          id: `${data.violation.student_id}-${Date.now()}`
        };
        
        setRealtimeViolations(prev => [violation, ...prev].slice(0, 5)); // Keep last 5
        
        // Show toast notification with appropriate icon based on violation type
        const violationType = data.violation.violation_type;
        let toastMessage = `${data.violation.student_name}: `;
        
        switch(violationType) {
          case 'LOOKING_AWAY':
            const direction = data.violation.metadata?.direction || 'away';
            const duration = data.violation.metadata?.duration || 0;
            toastMessage += `Looking ${direction} (${duration}s)`;
            break;
          case 'MULTIPLE_FACES':
            toastMessage += `Multiple faces detected`;
            break;
          case 'NO_FACE':
            toastMessage += `No face detected`;
            break;
          default:
            toastMessage += violationType.replace('_', ' ');
        }
        
        toast.error(`⚠️ ${toastMessage}`, { duration: 5000 });
        
        // Play notification sound (optional)
        playNotificationSound();
      }
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  const playNotificationSound = () => {
    // Create a simple beep sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  const handleDismissViolation = (violationId) => {
    setRealtimeViolations(prev => prev.filter(v => v.id !== violationId));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Subscribe to active quizzes for real-time monitoring
  useEffect(() => {
    if (isConnected && quizzes.length > 0) {
      quizzes.forEach(quiz => {
        if (quiz.status === 'active') {
          sendMessage({
            type: 'subscribe_quiz',
            quiz_id: quiz._id
          });
        }
      });
    }
  }, [isConnected, quizzes, sendMessage]);

  const fetchData = async () => {
    try {
      const [quizzesRes, flagsRes] = await Promise.all([
        quizAPI.getAll(),
        flagAPI.getAll()
      ]);
      setQuizzes(quizzesRes.data);
      setFlags(flagsRes.data);
    } catch (error) {
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const liveExams = quizzes
    .filter(q => q.status === 'active')
    .map(quiz => ({
      id: quiz._id,
      name: quiz.title,
      code: quiz.code,
      activeStudents: quiz.submissions?.length || 0,
      violations: flags.filter(f => f.quiz_id === quiz._id).length
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="Live Monitoring">
      {/* Real-time Violation Alerts */}
      <ViolationAlertContainer 
        violations={realtimeViolations}
        onDismiss={handleDismissViolation}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Monitoring</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor active exams in real-time
          {isConnected && (
            <span className="ml-2 inline-flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Connected
            </span>
          )}
        </p>
      </div>

      {liveExams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Exams</h3>
          <p className="text-gray-600 dark:text-gray-400">There are no exams running at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveExams.map((exam) => (
            <LiveMonitorCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
      </motion.div>
    </TeacherLayout>
  );
}
