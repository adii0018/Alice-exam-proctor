import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, MonitorPlay, AlertTriangle } from 'lucide-react';
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
import TeacherWelcomeCard from '../components/teacher/TeacherWelcomeCard';

export default function TeacherDashboardNew() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAliceChat, setShowAliceChat] = useState(false);
  const { darkMode } = useTheme();

  const [quizzes, setQuizzes] = useState([]);
  const [flags, setFlags] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({ average_score: 0, pass_rate: 0, completion_rate: 0 });
  const [stats, setStats] = useState({ totalExams: 0, activeExams: 0, totalStudents: 0, flaggedViolations: 0 });

  useEffect(() => { fetchData(); }, []);

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
      const { average_score, pass_rate, completion_rate } = dashboardStatsRes.data;
      setPerformanceMetrics({
        average_score: Number(average_score || 0),
        pass_rate: Number(pass_rate || 0),
        completion_rate: Number(completion_rate || 0),
      });
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to load dashboard data';
      if (status === 401) { toast.error('Session expired. Please sign in again.'); window.location.href = '/'; return; }
      if (status === 403) { toast.error('Teacher access required. Please log in as a teacher.'); return; }
      toast.error(`Failed to load dashboard data${status ? ` (${status})` : ''}`);
      console.error('Teacher dashboard fetch failed:', { status, msg, error });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { icon: FileText,      label: 'Total Exams',       value: stats.totalExams.toString(),       color: 'blue'   },
    { icon: MonitorPlay,   label: 'Active Exams',       value: stats.activeExams.toString(),      color: 'green'  },
    { icon: Users,         label: 'Total Students',     value: stats.totalStudents.toString(),    color: 'purple' },
    { icon: AlertTriangle, label: 'Flagged Violations', value: stats.flaggedViolations.toString(), color: 'orange' },
  ];

  const filteredQuizzes = searchQuery.trim()
    ? quizzes.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : quizzes;

  const exams = filteredQuizzes.map(quiz => ({
    id: quiz._id,
    name: quiz.title,
    code: quiz.code,
    status: quiz.is_active ? 'Live' : 'Draft',
    date: quiz.created_at ? new Date(quiz.created_at).toLocaleString() : '',
    duration: `${quiz.duration} min`,
    students: quiz.submissions?.length || 0,
    is_active: quiz.is_active || false,
  }));

  const liveExams = filteredQuizzes
    .filter(q => q.is_active === true)
    .map(quiz => ({
      id: quiz._id,
      name: quiz.title,
      code: quiz.code,
      activeStudents: quiz.submissions?.length || 0,
      violations: flags.filter(f => f.quiz_id === quiz._id).length,
    }));

  const filteredFlags = searchQuery.trim()
    ? flags.filter(f =>
        f.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.quiz_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flags;

  const violations = filteredFlags.slice(0, 5).map(flag => ({
    id: flag._id,
    student: flag.student_name || 'Unknown',
    exam: flag.quiz_title || 'Unknown',
    type: flag.type,
    severity: flag.severity.charAt(0).toUpperCase() + flag.severity.slice(1),
    time: new Date(flag.timestamp).toLocaleTimeString(),
  }));

  const handleExamAction = async (action, exam) => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete "${exam.name}"? This action cannot be undone.`)) return;
      try { await quizAPI.delete(exam.id); toast.success('Exam deleted successfully'); fetchData(); }
      catch { toast.error('Failed to delete exam'); }
    } else if (action === 'view') {
      window.location.href = `/teacher/live-monitoring?exam=${exam.id}`;
    } else if (action === 'edit') {
      window.location.href = `/teacher/exams?edit=${exam.id}`;
    } else if (action === 'start') {
      if (!confirm(`Start exam "${exam.name}"?`)) return;
      try { await quizAPI.update(exam.id, { status: 'active' }); toast.success('Exam started'); fetchData(); }
      catch { toast.error('Failed to start exam'); }
    } else if (action === 'end') {
      if (!confirm(`End exam "${exam.name}"?`)) return;
      try { await quizAPI.update(exam.id, { status: 'completed' }); toast.success('Exam ended'); fetchData(); }
      catch { toast.error('Failed to end exam'); }
    } else if (action === 'toggle_active') {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/quizzes/${exam.id}/toggle-active/`, {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success(data.message);
        fetchData();
      } catch { toast.error('Failed to toggle quiz status'); }
    }
  };

  const subtext = darkMode ? '#8b949e' : '#6b7280';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const accent  = darkMode ? '#3fb950' : '#059669';

  if (loading) {
    return (
      <TeacherLayout title="Dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="text-center">
            <div style={{ width: 52, height: 52, border: `3px solid ${darkMode ? '#2ea043' : '#3b82f6'}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: subtext }}>Loading dashboard...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 md:space-y-7">

        {/* Welcome Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <TeacherWelcomeCard stats={stats} />
        </motion.div>

        {/* Search result banner */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: darkMode ? 'rgba(46,160,67,0.08)' : '#eff6ff',
              border: `1px solid ${darkMode ? 'rgba(46,160,67,0.25)' : '#bfdbfe'}`,
              borderRadius: 10, padding: '10px 16px',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: darkMode ? subtext : '#1e40af', margin: 0 }}>
              Results for: <span style={{ fontWeight: 700, color: heading }}>"{searchQuery}"</span>
              {exams.length === 0 && violations.length === 0 && (
                <span style={{ marginLeft: 8, color: accent }}> — No results found</span>
              )}
            </p>
          </motion.div>
        )}

        {/* ── Stats Grid — 2 cols on mobile, 4 on desktop ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {statsCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* ── Main 2-col layout (like student dashboard) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-7">

          {/* Left — wide column */}
          <div className="lg:col-span-2 space-y-5 md:space-y-7">

            {/* Exam Management */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <ExamTable exams={exams.slice(0, searchQuery ? 10 : 4)} onAction={handleExamAction} />
            </motion.div>

            {/* Live Monitoring */}
            {liveExams.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <SectionHeader title="Live Monitoring" darkMode={darkMode} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {liveExams.map(exam => (
                    <LiveMonitorCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Performance Insights */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <PerformanceChart metrics={performanceMetrics} />
            </motion.div>
          </div>

          {/* Right — sidebar column */}
          <div className="space-y-5 md:space-y-7">

            {/* Recent Violations */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: heading, margin: 0 }}>
                  {searchQuery ? `Violations (${violations.length})` : 'Recent Violations'}
                </h2>
                <a href="/teacher/violations" style={{ fontSize: '0.78rem', color: accent, fontWeight: 600, textDecoration: 'none' }}>
                  View all →
                </a>
              </div>
              {violations.length > 0
                ? <ViolationsTable violations={violations} />
                : <EmptyCard label="No violations yet" darkMode={darkMode} />
              }
            </motion.div>


          </div>
        </div>
      </motion.div>

      {/* Alice AI Chat */}
      {showAliceChat && <AliceAIChat onClose={() => setShowAliceChat(false)} />}
      <button
        onClick={() => setShowAliceChat(prev => !prev)}
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40"
        style={{ background: 'linear-gradient(135deg, #2ea043, #1a7f37)', boxShadow: '0 0 0 3px rgba(46,160,67,0.25), 0 8px 24px rgba(0,0,0,0.4)' }}
        title="Chat with Alice AI"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* antenna */}
          <line x1="12" y1="2" x2="12" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="12" cy="1.5" r="1.2" fill="white"/>
          {/* head */}
          <rect x="4" y="5" width="16" height="11" rx="3" fill="white" fillOpacity="0.95"/>
          {/* eyes */}
          <circle cx="9" cy="10" r="1.8" fill="#2ea043"/>
          <circle cx="15" cy="10" r="1.8" fill="#2ea043"/>
          <circle cx="9.6" cy="9.4" r="0.6" fill="white"/>
          <circle cx="15.6" cy="9.4" r="0.6" fill="white"/>
          {/* mouth */}
          <rect x="8.5" y="13" width="7" height="1.5" rx="0.75" fill="#2ea043" fillOpacity="0.7"/>
          {/* body */}
          <rect x="7" y="17" width="10" height="5" rx="2" fill="white" fillOpacity="0.85"/>
          {/* arms */}
          <rect x="2" y="17.5" width="4" height="2.5" rx="1.25" fill="white" fillOpacity="0.7"/>
          <rect x="18" y="17.5" width="4" height="2.5" rx="1.25" fill="white" fillOpacity="0.7"/>
          {/* chest dot */}
          <circle cx="12" cy="19.5" r="1" fill="#2ea043" fillOpacity="0.6"/>
        </svg>
      </button>
    </TeacherLayout>
  );
}

/* ── Small helpers ── */

function SectionHeader({ title, darkMode }) {
  return (
    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827', margin: 0 }}>
      {title}
    </h2>
  );
}

function EmptyCard({ label, darkMode }) {
  return (
    <div style={{
      background: darkMode ? '#161b22' : '#fff',
      border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
      borderRadius: 12, padding: '28px 16px', textAlign: 'center',
      color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.875rem',
    }}>
      {label}
    </div>
  );
}


