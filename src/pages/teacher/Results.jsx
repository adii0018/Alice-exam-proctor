import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import PerformanceChart from '../../components/teacher/PerformanceChart';
import { TrendingUp, Award, Users, Target } from 'lucide-react';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';
import FullPageLoader from '../../components/loaders/FullPageLoader';

export default function Results() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.submissions?.length || 0), 0);
  const avgScore = 75; // Mock - calculate from actual submissions
  const passRate = 82; // Mock

  const stats = [
    { icon: Users, label: 'Total Submissions', value: totalSubmissions, color: 'blue' },
    { icon: Award, label: 'Average Score', value: `${avgScore}%`, color: 'green' },
    { icon: Target, label: 'Pass Rate', value: `${passRate}%`, color: 'purple' },
    { icon: TrendingUp, label: 'Improvement', value: '+12%', color: 'orange' },
  ];

  if (loading) {
    return <FullPageLoader />;
  }

  const { darkMode } = useTheme();
  const cardColors = { blue: '#58a6ff', green: '#3fb950', purple: '#bc8cff', orange: '#f0883e' };

  return (
    <TeacherLayout title="Results">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>Results & Analytics</h2>
        <p style={{ color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4 }}>Track student performance and exam statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const c = cardColors[stat.color];
          return (
            <div key={index} style={{ background: darkMode ? '#161b22' : '#fff', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 12, padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: darkMode ? `${c}22` : `${c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} color={c} />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>{stat.value}</p>
              <p style={{ fontSize: '0.875rem', color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4 }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <PerformanceChart />

      <div style={{ background: darkMode ? '#161b22' : '#fff', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}` }}>
          <h3 style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>Recent Exam Results</h3>
        </div>
        <div style={{ padding: 24 }}>
          {quizzes.length === 0 ? (
            <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', padding: '32px 0' }}>No results available yet</p>
          ) : (
            <div className="space-y-4">
              {quizzes.slice(0, 5).map(quiz => (
                <div key={quiz._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: darkMode ? '#1c2128' : '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <h4 style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>{quiz.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: darkMode ? '#8b949e' : '#6b7280' }}>{quiz.submissions?.length || 0} submissions</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>--</p>
                    <p style={{ fontSize: '0.875rem', color: darkMode ? '#8b949e' : '#6b7280' }}>Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </motion.div>
    </TeacherLayout>
  );
}
