import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, FileText, Presentation, GraduationCap, Activity, Server, Database, Cloud, Radio, ChevronRight, RefreshCw, Download, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Mock stats that simulate backend data ─────────────────────────────────────
const MOCK_STATS = { totalUsers: 1420, activeExams: 12, totalTeachers: 45, totalStudents: 1375 };
const MOCK_HEALTH = [
  { name: 'WebSocket', status: 'Operational', icon: Radio,    ping: '12ms', color: '#3fb950' },
  { name: 'AI Service', status: 'Optimal',     icon: Activity, ping: '45ms', color: '#3fb950' },
  { name: 'Database',  status: 'Healthy',      icon: Database, ping: '8ms',  color: '#3fb950' },
  { name: 'Storage',   status: '92% Free',     icon: Cloud,    ping: '—',    color: '#e3b341' },
];
const MOCK_ACTIVITIES = [
  { id: 1, title: 'Physics Final Exam started',   author: 'Prof. Johnson', time: '9s ago',  type: 'exam',  color: '#8957e5' },
  { id: 2, title: 'High severity alert in Math',  author: 'AI Proctor',    time: '2m ago',  type: 'alert', color: '#f85149' },
  { id: 3, title: 'New student registered',       author: 'Sarah W.',      time: '5m ago',  type: 'user',  color: '#2ea043' },
  { id: 4, title: 'Chemistry exam locked by admin', author: 'Super Admin', time: '10m ago', type: 'exam',  color: '#e3b341' },
];
const MOCK_EXAMS = [
  { label: 'Live',      count: 12, color: '#3fb950' },
  { label: 'Completed', count: 45, color: '#8b949e' },
  { label: 'Scheduled', count: 23, color: '#e3b341' },
  { label: 'Flagged',   count: 5,  color: '#f85149' },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]         = useState(MOCK_STATS);
  const [health]                  = useState(MOCK_HEALTH);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [exams]                   = useState(MOCK_EXAMS);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate fetching from backend
  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/dashboard/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || MOCK_STATS);
        setActivities(data.recent_activity || MOCK_ACTIVITIES);
      }
    } catch {
      // Backend not available – keep mock data silently
    } finally {
      setLastRefresh(new Date());
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Download Report ───────────────────────────────────────────────────────────
  const downloadReport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', stats.totalUsers],
      ['Active Exams', stats.activeExams],
      ['Total Teachers', stats.totalTeachers],
      ['Total Students', stats.totalStudents],
      ['Live Exams', exams.find(e => e.label === 'Live')?.count],
      ['Completed Exams', exams.find(e => e.label === 'Completed')?.count],
      ['Scheduled Exams', exams.find(e => e.label === 'Scheduled')?.count],
      ['Flagged Exams', exams.find(e => e.label === 'Flagged')?.count],
      ['Report Generated', new Date().toLocaleString()],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `admin-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ea043] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8957e5] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e6edf3] to-[#8b949e] tracking-tight">
                Command Center
              </h1>
              <p className="text-[#8b949e] mt-2 font-medium flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2ea043]" />
                </span>
                System operational · Last refreshed: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex gap-3 flex-wrap">
              <button
                onClick={fetchStats}
                disabled={refreshing}
                className="px-4 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] text-sm font-semibold rounded-lg border border-[#30363d] transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={downloadReport}
                className="px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] text-sm font-semibold rounded-lg border border-[#30363d] transition-all flex items-center gap-2"
              >
                <Download size={14} /> Download Report
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="px-5 py-2.5 bg-[#2ea043] hover:bg-[#3fb950] text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(46,160,67,0.4)] transition-all flex items-center gap-2"
              >
                <Settings size={14} /> System Config
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Users',    value: stats.totalUsers,    icon: Users,          color: '#3fb950', glow: 'rgba(63,185,80,0.15)',   link: '/admin/users' },
            { title: 'Active Exams',   value: stats.activeExams,   icon: FileText,       color: '#8957e5', glow: 'rgba(137,87,229,0.15)',  link: '/admin/exams' },
            { title: 'Total Teachers', value: stats.totalTeachers, icon: Presentation,   color: '#e3b341', glow: 'rgba(227,179,65,0.15)',  link: '/admin/users' },
            { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap,  color: '#3fb950', glow: 'rgba(63,185,80,0.15)',   link: '/admin/users' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => navigate(stat.link)}
              className="relative group bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-gray-500 cursor-pointer"
              style={{ boxShadow: `0 0 20px ${stat.glow}` }}
            >
              <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-500" style={{ color: stat.color }}>
                <stat.icon size={100} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] font-semibold text-sm tracking-wide uppercase">{stat.title}</span>
                  <div className="p-2 rounded-lg bg-[#161b22] border border-[#30363d]" style={{ color: stat.color }}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-[#e6edf3] tracking-tight">{stat.value.toLocaleString()}</h2>
                  <div className="h-1 w-full bg-[#21262d] rounded-full mt-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: '70%', backgroundColor: stat.color }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-[#e6edf3] mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#8b949e]" /> Exam Distribution Matrix
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {exams.map((exam, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/admin/exams')}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <div className="text-3xl font-extrabold mb-1" style={{ color: exam.color }}>{exam.count}</div>
                  <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{exam.label}</div>
                </div>
              ))}
            </div>

            {/* Visual Bar */}
            <div className="w-full h-4 flex rounded-full overflow-hidden shadow-inner bg-[#21262d]">
              {exams.map((exam, i) => (
                <div
                  key={i}
                  style={{ width: `${(exam.count / 85) * 100}%`, backgroundColor: exam.color }}
                  className="h-full hover:opacity-80 transition-opacity cursor-pointer"
                  title={`${exam.label}: ${exam.count}`}
                />
              ))}
            </div>

            {/* System Health */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {health.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <h.icon size={16} className="text-[#8b949e]" />
                    <span className="text-sm font-medium text-[#e6edf3]">{h.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: h.color }}>{h.status}</span>
                    {h.ping !== '—' && <span className="text-[10px] text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">{h.ping}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ea043] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-lg font-bold text-[#e6edf3] mb-6 flex items-center justify-between">
              Live Activity Stream
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#f85149] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f85149]" />
              </span>
            </h3>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 group">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: act.color }} />
                  <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-3 hover:border-gray-500 transition-colors">
                    <p className="text-sm font-bold text-[#e6edf3] leading-tight">{act.title}</p>
                    <p className="text-xs text-[#8b949e] mt-1 flex items-center justify-between">
                      <span>{act.author} · {act.time}</span>
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2ea043]" />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/admin/audit')}
              className="w-full mt-6 py-3 bg-[#161b22] hover:bg-[#30363d] text-[#e6edf3] text-xs font-bold uppercase tracking-widest rounded-lg border border-[#30363d] transition-colors"
            >
              View All Logs →
            </button>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
