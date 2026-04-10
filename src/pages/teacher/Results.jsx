import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { teacherAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Award, Users, Target, TrendingUp, Radio, RefreshCw } from 'lucide-react';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../utils/api';
const POLL_MS = 5000;

export default function Results() {
  const [allRows, setAllRows] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const fetchAll = useCallback(async (opts = { silent: false }) => {
    const silent = opts.silent === true;
    try {
      if (!silent) setLoading(true);
      const [resultsRes, statsRes] = await Promise.all([
        teacherAPI.allResults(),
        api.get('/teacher/dashboard-stats/'),
      ]);
      setDashboardStats(statsRes.data);
      setAllRows(resultsRes.data?.results || []);
    } catch (err) {
      if (!silent) {
        console.error('[Results] fetchAll error:', err?.response?.data || err);
        toast.error('Failed to load results — ' + (err?.response?.data?.error || err?.message || 'Unknown error'));
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll({ silent: false });
  }, [fetchAll]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchAll({ silent: true });
    }, POLL_MS);
    const onFocus = () => fetchAll({ silent: true });
    const onVis = () => {
      if (document.visibilityState === 'visible') fetchAll({ silent: true });
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [fetchAll]);

  const wsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return;

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      return;
    }
    const teacherId = user._id || user.id;
    if (!teacherId) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const wsBase = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://').replace(/\/api\/?$/, '');
    const url = `${wsBase}/ws/teacher/monitor/${teacherId}/?token=${encodeURIComponent(token)}`;

    let stopped = false;
    let reconnectTimer;

    const connect = () => {
      if (stopped) return;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[Results WS] Connected to teacher monitoring channel');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[Results WS] Message received:', data);
            if (data.type === 'QUIZ_SUBMISSION' && data.submission) {
              const s = data.submission;
              fetchAll({ silent: true });
              toast.success(
                `🎉 ${s.student_name || 'Student'}${s.student_email ? ` (${s.student_email})` : ''} · ${s.quiz_title || 'Exam'} · ${Number(s.score).toFixed(1)}%`,
                { duration: 6000 }
              );
            }
          } catch {
            /* ignore */
          }
        };

        ws.onerror = (err) => {
          console.warn('[Results WS] WebSocket error:', err);
        };

        ws.onclose = (evt) => {
          console.log('[Results WS] Disconnected, code:', evt.code, '— reconnecting...');
          wsRef.current = null;
          if (!stopped) {
            reconnectTimer = window.setTimeout(connect, 3500);
          }
        };
      } catch {
        if (!stopped) reconnectTimer = window.setTimeout(connect, 5000);
      }
    };

    connect();
    return () => {
      stopped = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [fetchAll]);

  const totalSubmissions = dashboardStats?.total_submissions || 0;
  const avgScore = dashboardStats?.average_score || 0;
  const passRate = dashboardStats?.pass_rate || 0;
  const completionRate = (() => {
    const expected = (dashboardStats?.total_exams || 0) * (dashboardStats?.total_students || 0);
    if (!expected) return 0;
    return Math.min(100, (totalSubmissions / expected) * 100);
  })();

  const cardColors = { blue: '#58a6ff', green: '#3fb950', purple: '#bc8cff', orange: '#f0883e' };
  const stats = [
    { icon: Users, label: 'Total Submissions', value: totalSubmissions, color: 'blue' },
    { icon: Award, label: 'Average Score', value: `${Number(avgScore).toFixed(1)}%`, color: 'green' },
    { icon: Target, label: 'Pass Rate', value: `${Number(passRate).toFixed(1)}%`, color: 'purple' },
    { icon: TrendingUp, label: 'Completion Rate', value: `${Number(completionRate).toFixed(1)}%`, color: 'orange' },
  ];

  const border = darkMode ? '#30363d' : '#e5e7eb';
  const cardBg = darkMode ? '#161b22' : '#fff';
  const textPrimary = darkMode ? '#e6edf3' : '#111827';
  const textSub = darkMode ? '#8b949e' : '#6b7280';

  if (loading) {
    return (
      <TeacherLayout title="Results">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
          <div style={{ width: 48, height: 48, border: '3px solid #2ea043', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Results">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>Results & Analytics</h2>
              <p style={{ color: textSub, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span>Student-wise quiz scores from your exams only</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3fb950' }}>
                  <Radio size={14} aria-hidden />
                  Instant updates via WebSocket · backup refresh ~{POLL_MS / 1000}s
                </span>
              </p>
            </div>
            <button
              onClick={() => fetchAll({ silent: false })}
              title="Manually refresh results"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8, border: `1px solid ${border}`,
                background: cardBg, color: textPrimary, cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
              }}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const c = cardColors[stat.color];
            return (
              <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: `${c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color={c} />
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: textPrimary }}>{stat.value}</p>
                <p style={{ fontSize: '0.875rem', color: textSub, marginTop: 4 }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Flat results table */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}` }}>
            <h3 style={{ fontWeight: 600, color: textPrimary, margin: 0 }}>Student Results</h3>
          </div>
          {allRows.length === 0 ? (
            <p style={{ textAlign: 'center', color: textSub, padding: '40px 0' }}>No submissions yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0d1117' : '#f9fafb' }}>
                    {['#', 'Student Name', 'Email', 'Quiz', 'Score', 'Correct', 'Submitted At'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: textSub, borderBottom: `1px solid ${border}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((row, i) => (
                    <motion.tr
                      key={row.submission_id || i}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}` }}
                    >
                      <td style={{ padding: '12px 16px', color: textSub, fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', color: textPrimary, fontWeight: 600 }}>{row.student_name || '—'}</td>
                      <td style={{ padding: '12px 16px', color: textSub, fontSize: 13 }}>{row.student_email || '—'}</td>
                      <td style={{ padding: '12px 16px', color: textSub }}>{row.quiz_title}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 700,
                          background: Number(row.score) >= 50
                            ? (darkMode ? '#2ea04322' : '#dcfce7')
                            : (darkMode ? '#f8514922' : '#fee2e2'),
                          color: Number(row.score) >= 50
                            ? (darkMode ? '#3fb950' : '#16a34a')
                            : (darkMode ? '#f85149' : '#dc2626'),
                        }}>
                          {Number(row.score).toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: textSub }}>{row.correct_answers}/{row.total_questions}</td>
                      <td style={{ padding: '12px 16px', color: textSub, fontSize: '0.85rem' }}>
                        {row.submitted_at ? new Date(row.submitted_at).toLocaleString('en-IN') : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </TeacherLayout>
  );
}
