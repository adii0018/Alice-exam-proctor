import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Users, MonitorPlay, AlertTriangle } from 'lucide-react';
import api, { quizAPI, flagAPI } from '../utils/api';
import toast from 'react-hot-toast';
import TeacherLayout from '../components/teacher/TeacherLayout';
import StatCard from '../components/teacher/StatCard';
import ExamTable from '../components/teacher/ExamTable';
import LiveMonitorCard from '../components/teacher/LiveMonitorCard';
import ViolationsTable from '../components/teacher/ViolationsTable';
import PerformanceChart from '../components/teacher/PerformanceChart';
import { useTheme } from '../contexts/ThemeContext';
import AliceAIChat from '../components/ai/AliceAIChat';
import { FaLeaf } from 'react-icons/fa';

export default function TeacherDashboardNew() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAliceChat, setShowAliceChat] = useState(false);
  const { darkMode } = useTheme();
  
  // Real data from backend
  const [quizzes, setQuizzes] = useState([]);
  const [flags, setFlags] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    average_score: 0,
    pass_rate: 0,
    completion_rate: 0,
  });
  const [stats, setStats] = useState({
    totalExams: 0,
    activeExams: 0,
    totalStudents: 0,
    flaggedViolations: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, flagsRes, dashboardStatsRes] = await Promise.all([
        quizAPI.getAll(),
        flagAPI.getAll(),
        api.get('/teacher/dashboard-stats/'),
      ]);
      
      setQuizzes(quizzesRes.data);
      setFlags(flagsRes.data);
      
      setStats({
        totalExams: dashboardStatsRes.data.total_exams,
        activeExams: dashboardStatsRes.data.active_exams,
        totalStudents: dashboardStatsRes.data.total_students,
        flaggedViolations: dashboardStatsRes.data.flagged_violations,
      });

      const { total_exams, total_students, total_submissions, average_score, pass_rate } = dashboardStatsRes.data
      const expected = (total_exams || 0) * (total_students || 0)
      const completion_rate = expected > 0 ? (total_submissions / expected) * 100 : 0
      setPerformanceMetrics({
        average_score: Number(average_score || 0),
        pass_rate: Number(pass_rate || 0),
        completion_rate: Number(Math.min(100, completion_rate || 0)),
      })
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load dashboard data';

      // Helpful, actionable auth messages
      if (status === 401) {
        toast.error('Session expired. Please sign in again.');
        window.location.href = '/';
        return;
      }
      if (status === 403) {
        toast.error('Teacher access required. Please log in as a teacher.');
        return;
      }

      toast.error(`Failed to load dashboard data${status ? ` (${status})` : ''}`);
      // Keep a detailed log for debugging
      console.error('Teacher dashboard fetch failed:', { status, msg, error });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { icon: FileText, label: 'Total Exams', value: stats.totalExams.toString(), color: 'blue' },
    { icon: MonitorPlay, label: 'Active Exams', value: stats.activeExams.toString(), color: 'green' },
    { icon: Users, label: 'Total Students', value: stats.totalStudents.toString(), color: 'purple' },
    { icon: AlertTriangle, label: 'Flagged Violations', value: stats.flaggedViolations.toString(), color: 'orange' },
  ];

  // Filter data based on search query
  const filteredQuizzes = searchQuery.trim()
    ? quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quizzes;

  // Transform quizzes to exam format
  const exams = filteredQuizzes.map(quiz => ({
    id: quiz._id,
    name: quiz.title,
    code: quiz.code,
    status: quiz.is_active ? 'Live' : 'Draft',
    date: quiz.created_at ? new Date(quiz.created_at).toLocaleString() : '',
    duration: `${quiz.duration} min`,
    students: quiz.submissions?.length || 0,
    is_active: quiz.is_active || false
  }));

  // Get live exams
  const liveExams = filteredQuizzes
    .filter(q => q.is_active === true)
    .map(quiz => ({
      id: quiz._id,
      name: quiz.title,
      code: quiz.code,
      activeStudents: quiz.submissions?.length || 0,
      violations: flags.filter(f => f.quiz_id === quiz._id).length
    }));

  // Transform flags to violations format (filter by search if needed)
  const filteredFlags = searchQuery.trim()
    ? flags.filter(flag =>
        flag.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.quiz_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flags;

  const violations = filteredFlags.slice(0, 5).map(flag => ({
    id: flag._id,
    student: flag.student_name || 'Unknown',
    exam: flag.quiz_title || 'Unknown',
    type: flag.type,
    severity: flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1),
    time: new Date(flag.timestamp).toLocaleTimeString()
  }));

  const handleExamAction = async (action, exam) => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete "${exam.name}"? This action cannot be undone.`)) return;
      try {
        await quizAPI.delete(exam.id);
        toast.success('Exam deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete exam');
        console.error('Delete error:', error);
      }
    } else if (action === 'view') {
      // Navigate to live monitoring page
      window.location.href = `/teacher/live-monitoring?exam=${exam.id}`;
    } else if (action === 'edit') {
      // Navigate to exam edit page
      window.location.href = `/teacher/exams?edit=${exam.id}`;
    } else if (action === 'start') {
      if (!confirm(`Start exam "${exam.name}"?`)) return;
      try {
        await quizAPI.update(exam.id, { status: 'active' });
        toast.success('Exam started successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to start exam');
        console.error('Start error:', error);
      }
    } else if (action === 'end') {
      if (!confirm(`End exam "${exam.name}"?`)) return;
      try {
        await quizAPI.update(exam.id, { status: 'completed' });
        toast.success('Exam ended successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to end exam');
        console.error('End error:', error);
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
        fetchData();
      } catch (error) {
        toast.error('Failed to toggle quiz status');
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <TeacherLayout title="Dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="text-center">
            <div style={{ width: 56, height: 56, border: `3px solid ${darkMode ? '#2ea043' : '#3b82f6'}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>Loading dashboard...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Search Results Info */}
        {searchQuery && (
          <div style={{
            background: darkMode ? 'rgba(46,160,67,0.08)' : '#eff6ff',
            border: `1px solid ${darkMode ? 'rgba(46,160,67,0.25)' : '#bfdbfe'}`,
            borderRadius: 8,
            padding: '12px 16px',
          }}>
            <p style={{ fontSize: '0.875rem', color: darkMode ? '#8b949e' : '#1e40af' }}>
              Showing results for: <span style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#1e3a8a' }}>"{searchQuery}"</span>
              {exams.length === 0 && violations.length === 0 && (
                <span style={{ marginLeft: 8, color: darkMode ? '#3fb950' : '#2563eb' }}>- No results found</span>
              )}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Exam Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }} className="md:text-xl">
              {searchQuery ? `Search Results - Exams (${exams.length})` : 'Recent Exams'}
            </h2>
            <a href="/teacher/exams" style={{ fontSize: '0.875rem', color: darkMode ? '#3fb950' : '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
              View All
            </a>
          </div>
          {exams.length > 0 ? (
            <ExamTable exams={exams.slice(0, searchQuery ? 10 : 4)} onAction={handleExamAction} />
          ) : (
            <div style={{
              background: darkMode ? '#161b22' : '#fff',
              border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
              borderRadius: 8,
              padding: '32px',
              textAlign: 'center',
            }}>
              <p style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>No exams found</p>
            </div>
          )}
        </div>

        {/* Live Monitoring */}
        {liveExams.length > 0 && (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }} className="md:text-xl">Live Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {liveExams.map((exam) => (
                <LiveMonitorCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <PerformanceChart metrics={performanceMetrics} />

        {/* Recent Violations */}
        {violations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }} className="md:text-xl">
                {searchQuery ? `Search Results - Violations (${violations.length})` : 'Recent Violations'}
              </h2>
              <a href="/teacher/violations" style={{ fontSize: '0.875rem', color: darkMode ? '#3fb950' : '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                View All
              </a>
            </div>
            <ViolationsTable violations={violations} />
          </div>
        )}
      </motion.div>

      {/* Alice AI Chat */}
      {showAliceChat && <AliceAIChat onClose={() => setShowAliceChat(false)} />}
      <button
        onClick={() => setShowAliceChat(prev => !prev)}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #9333ea)' }}
        title="Chat with Alice AI"
      >
        <FaLeaf className="text-white text-xl" />
      </button>
    </TeacherLayout>
  );
}
