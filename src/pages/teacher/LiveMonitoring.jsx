import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI, flagAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import LiveMonitorCard from '../../components/teacher/LiveMonitorCard';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { ViolationAlertContainer } from '../../components/teacher/ViolationAlert';
import useWebSocket from '../../hooks/useWebSocket';
import { useTheme } from '../../contexts/ThemeContext';
import FullPageLoader from '../../components/loaders/FullPageLoader';

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
    // Always poll every 5s as fallback (also works when WebSocket is not connected)
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

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
    return <FullPageLoader />;
  }

  const { darkMode } = useTheme();

  return (
    <TeacherLayout title="Live Monitoring">
      <ViolationAlertContainer violations={realtimeViolations} onDismiss={handleDismissViolation} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>Live Monitoring</h2>
        <p style={{ color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          Monitor active exams in real-time
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: isConnected ? '#3fb950' : '#f0883e' }}>
            <span style={{ width: 8, height: 8, background: isConnected ? '#3fb950' : '#f0883e', borderRadius: '50%', display: 'inline-block' }} />
            {isConnected ? 'Live' : 'Polling'}
          </span>
        </p>
      </div>

      {liveExams.length === 0 ? (
        <div style={{ background: darkMode ? '#161b22' : '#fff', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: darkMode ? '#21262d' : '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>📊</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827', marginBottom: 8 }}>No Active Exams</h3>
          <p style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>There are no exams running at the moment</p>
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
