import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Users, MonitorPlay, AlertTriangle } from 'lucide-react';
import { quizAPI, flagAPI } from '../utils/api';
import toast from 'react-hot-toast';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import TeacherNavbar from '../components/teacher/TeacherNavbar';
import StatCard from '../components/teacher/StatCard';
import ExamTable from '../components/teacher/ExamTable';
import LiveMonitorCard from '../components/teacher/LiveMonitorCard';
import ViolationsTable from '../components/teacher/ViolationsTable';
import PerformanceChart from '../components/teacher/PerformanceChart';

export default function TeacherDashboardNew() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real data from backend
  const [quizzes, setQuizzes] = useState([]);
  const [flags, setFlags] = useState([]);
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
      const [quizzesRes, flagsRes] = await Promise.all([
        quizAPI.getAll(),
        flagAPI.getAll()
      ]);
      
      setQuizzes(quizzesRes.data);
      setFlags(flagsRes.data);
      
      // Calculate stats
      setStats({
        totalExams: quizzesRes.data.length,
        activeExams: quizzesRes.data.filter(q => q.status === 'active').length,
        totalStudents: 156, // This would come from backend
        flaggedViolations: flagsRes.data.filter(f => f.status !== 'resolved').length
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
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
    status: quiz.status === 'active' ? 'Live' : 'Draft',
    date: new Date(quiz.createdAt).toLocaleString(),
    duration: `${quiz.duration} min`,
    students: quiz.submissions?.length || 0
  }));

  // Get live exams
  const liveExams = filteredQuizzes
    .filter(q => q.status === 'active')
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
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <TeacherSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="transition-all"
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      >
        <TeacherNavbar
          title="Dashboard"
          sidebarCollapsed={sidebarCollapsed}
          onSearch={handleSearch}
        />

        <main className="pt-16 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Search Results Info */}
            {searchQuery && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Showing results for: <span className="font-semibold">"{searchQuery}"</span>
                  {exams.length === 0 && violations.length === 0 && (
                    <span className="ml-2 text-blue-600 dark:text-blue-300">- No results found</span>
                  )}
                </p>
              </div>
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Exam Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {searchQuery ? `Search Results - Exams (${exams.length})` : 'Recent Exams'}
                </h2>
                <a href="/teacher/exams" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View All
                </a>
              </div>
              {exams.length > 0 ? (
                <ExamTable exams={exams.slice(0, searchQuery ? 10 : 4)} onAction={handleExamAction} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No exams found</p>
                </div>
              )}
            </div>

            {/* Live Monitoring */}
            {liveExams.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Live Monitoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveExams.map((exam) => (
                    <LiveMonitorCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </div>
            )}

            {/* Performance Insights */}
            <PerformanceChart />

            {/* Recent Violations */}
            {violations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {searchQuery ? `Search Results - Violations (${violations.length})` : 'Recent Violations'}
                  </h2>
                  <a href="/teacher/violations" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    View All
                  </a>
                </div>
                <ViolationsTable violations={violations} />
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
