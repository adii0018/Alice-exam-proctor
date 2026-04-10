import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { quizAPI, teacherAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import PerformanceChart from '../../components/teacher/PerformanceChart';
import { TrendingUp, Award, Users, Target, X } from 'lucide-react';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';

export default function Results() {
  const [quizzes, setQuizzes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const [quizzesRes, statsRes] = await Promise.all([
        quizAPI.getAll(),
        api.get('/teacher/dashboard-stats/'),
      ]);
      setQuizzes(quizzesRes.data);
      setDashboardStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const openQuizResults = async (quiz) => {
    const quizId = quiz._id || quiz.id;
    setSelectedQuiz({ id: quizId, title: quiz.title });
    setLoadingResults(true);
    setQuizResults([]);

    try {
      const res = await teacherAPI.quizResults(quizId);
      setQuizResults(res.data.results || []);
    } catch (error) {
      toast.error('Failed to load quiz results');
      setSelectedQuiz(null);
    } finally {
      setLoadingResults(false);
    }
  };

  const totalSubmissions = dashboardStats?.total_submissions || 0;
  const avgScore = dashboardStats?.average_score || 0;
  const passRate = dashboardStats?.pass_rate || 0;
  const completionRate = (() => {
    const expected = (dashboardStats?.total_exams || 0) * (dashboardStats?.total_students || 0);
    if (!expected) return 0;
    return Math.min(100, (totalSubmissions / expected) * 100);
  })();

  const performanceMetrics = {
    average_score: avgScore,
    pass_rate: passRate,
    completion_rate: completionRate,
  };

  const stats = [
    { icon: Users, label: 'Total Submissions', value: totalSubmissions, color: 'blue' },
    { icon: Award, label: 'Average Score', value: `${Number(avgScore).toFixed(1)}%`, color: 'green' },
    { icon: Target, label: 'Pass Rate', value: `${Number(passRate).toFixed(1)}%`, color: 'purple' },
    { icon: TrendingUp, label: 'Completion Rate', value: `${Number(completionRate).toFixed(1)}%`, color: 'orange' },
  ];

  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <div style={{ width: 48, height: 48, border: '3px solid #2ea043', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }
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

      <PerformanceChart metrics={performanceMetrics} />

      <div style={{ background: darkMode ? '#161b22' : '#fff', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}` }}>
          <h3 style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>Quiz-wise Results</h3>
        </div>
        <div style={{ padding: 24 }}>
          {quizzes.length === 0 ? (
            <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', padding: '32px 0' }}>No results available yet</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <div key={quiz._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: darkMode ? '#1c2128' : '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <h4 style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>{quiz.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: darkMode ? '#8b949e' : '#6b7280' }}>{quiz.submissions?.length || 0} submissions</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => openQuizResults(quiz)}
                      style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: darkMode ? '#388bfd22' : '#dbeafe',
                        color: darkMode ? '#58a6ff' : '#1d4ed8',
                      }}
                    >
                      View Students
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={(e) => e.target === e.currentTarget && setSelectedQuiz(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              style={{
                width: '100%',
                maxWidth: 900,
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 12,
                background: darkMode ? '#161b22' : '#fff',
                border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
              }}
            >
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>
                    {selectedQuiz.title} - Student Marks
                  </h3>
                  <p style={{ margin: 0, marginTop: 4, fontSize: '0.85rem', color: darkMode ? '#8b949e' : '#6b7280' }}>
                    Per student score for this quiz
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  style={{
                    border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                    background: darkMode ? '#0d1117' : '#f9fafb',
                    color: darkMode ? '#8b949e' : '#6b7280',
                    borderRadius: 8,
                    cursor: 'pointer',
                    padding: 8,
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflow: 'auto', padding: 18 }}>
                {loadingResults ? (
                  <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', padding: '20px 0' }}>Loading student marks...</p>
                ) : quizResults.length === 0 ? (
                  <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', padding: '20px 0' }}>No submissions for this quiz yet</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: darkMode ? '#0d1117' : '#f9fafb' }}>
                        {['Student Name', 'Email', 'Marks', 'Correct', 'Submitted At'].map(head => (
                          <th
                            key={head}
                            style={{
                              textAlign: 'left',
                              padding: '10px 12px',
                              fontSize: 12,
                              color: darkMode ? '#8b949e' : '#6b7280',
                              borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                            }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((row) => (
                        <tr key={row.submission_id} style={{ borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}` }}>
                          <td style={{ padding: '10px 12px', color: darkMode ? '#e6edf3' : '#111827', fontWeight: 600 }}>{row.student_name}</td>
                          <td style={{ padding: '10px 12px', color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.9rem' }}>{row.student_email || '-'}</td>
                          <td style={{ padding: '10px 12px', color: darkMode ? '#58a6ff' : '#1d4ed8', fontWeight: 700 }}>{Number(row.score).toFixed(1)}%</td>
                          <td style={{ padding: '10px 12px', color: darkMode ? '#8b949e' : '#6b7280' }}>
                            {row.correct_answers}/{row.total_questions}
                          </td>
                          <td style={{ padding: '10px 12px', color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.85rem' }}>
                            {row.submitted_at ? new Date(row.submitted_at).toLocaleString('en-IN') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </TeacherLayout>
  );
}
