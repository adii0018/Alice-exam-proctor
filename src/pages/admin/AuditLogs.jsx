import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FileSearch, Shield, UserX, Settings, AlertTriangle, Download, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Mock audit logs ──────────────────────────────────────────────────────────
const MOCK_LOGS = [
  { _id: '1', action: 'user_ban',         admin_id: 'admin1', admin_name: 'Super Admin', target: 'john.doe@example.com',     timestamp: new Date(Date.now()-300000).toISOString(),    details: 'User banned for repeated violations (5+ high severity)' },
  { _id: '2', action: 'exam_force_stop',  admin_id: 'admin1', admin_name: 'Super Admin', target: 'Math Final Exam (MTH-001)',  timestamp: new Date(Date.now()-3600000).toISOString(),   details: 'Exam stopped due to widespread cheating detected by AI' },
  { _id: '3', action: 'settings_change',  admin_id: 'admin1', admin_name: 'Super Admin', target: 'Violation Thresholds',      timestamp: new Date(Date.now()-7200000).toISOString(),   details: 'Updated violation threshold from 3 to 5; Auto-submit enabled' },
  { _id: '4', action: 'rule_change',      admin_id: 'admin2', admin_name: 'Alice System', target: 'AI Sensitivity Policy',    timestamp: new Date(Date.now()-86400000).toISOString(),  details: 'AI proctoring sensitivity changed from medium to high' },
  { _id: '5', action: 'user_ban',         admin_id: 'admin1', admin_name: 'Super Admin', target: 'priya.cheat@student.com',  timestamp: new Date(Date.now()-172800000).toISOString(), details: 'Account suspended pending review of Physics exam violation' },
  { _id: '6', action: 'exam_force_stop',  admin_id: 'admin2', admin_name: 'Alice System', target: 'CS Mid-Term (CS-002)',    timestamp: new Date(Date.now()-259200000).toISOString(), details: 'Automated stop: 80% of students flagged in 10 minutes' },
  { _id: '7', action: 'settings_change',  admin_id: 'admin1', admin_name: 'Super Admin', target: 'Email Notifications',      timestamp: new Date(Date.now()-345600000).toISOString(), details: 'Email alerts enabled for critical violations' },
];

const ACTION_CONFIG = {
  user_ban:        { icon: UserX,        color: 'text-red-400 bg-red-500/15 border border-red-500/30',         label: 'User Ban' },
  exam_force_stop: { icon: AlertTriangle,color: 'text-orange-400 bg-orange-500/15 border border-orange-500/30', label: 'Exam Force Stop' },
  settings_change: { icon: Settings,     color: 'text-blue-400 bg-blue-500/15 border border-blue-500/30',       label: 'Settings Change' },
  rule_change:     { icon: Shield,       color: 'text-purple-400 bg-purple-500/15 border border-purple-500/30', label: 'Rule Change' },
};

function inRange(ts, range) {
  if (range === 'all') return true;
  const d = new Date(ts), now = new Date();
  if (range === 'today') return d.toDateString() === now.toDateString();
  if (range === 'week')  { const w = new Date(now); w.setDate(now.getDate()-7);   return d >= w; }
  if (range === 'month') { const m = new Date(now); m.setMonth(now.getMonth()-1); return d >= m; }
  return true;
}

const AuditLogs = () => {
  const [logs, setLogs]           = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [filters, setFilters]     = useState({ action: 'all', admin: 'all', dateRange: 'all' });
  const [loading, setLoading]     = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs?.length ? data.logs : MOCK_LOGS);
      } else { setLogs(MOCK_LOGS); }
    } catch { setLogs(MOCK_LOGS); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  // Build dynamic admin list
  const adminOptions = [{ id: 'all', name: 'All Admins' }, ...Array.from(new Map(logs.map(l => [l.admin_id, { id: l.admin_id, name: l.admin_name }])).values())];

  useEffect(() => {
    let list = [...logs];
    if (filters.action !== 'all')    list = list.filter(l => l.action === filters.action);
    if (filters.admin !== 'all')     list = list.filter(l => l.admin_id === filters.admin);
    if (filters.dateRange !== 'all') list = list.filter(l => inRange(l.timestamp, filters.dateRange));
    setFiltered(list);
  }, [logs, filters]);

  const setF = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const exportLogs = () => {
    const rows = [
      ['Timestamp', 'Action', 'Admin', 'Target', 'Details'],
      ...filtered.map(l => [
        new Date(l.timestamp).toLocaleString(),
        l.action, l.admin_name, l.target, `"${l.details}"`,
      ]),
    ];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `audit-logs-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} audit logs!`);
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">Audit Logs</h1>
            <p className="text-[#8b949e] mt-1">Track all administrative actions and system changes</p>
          </div>
          <button onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm">
            <Download className="w-4 h-4" /> Export Logs ({filtered.length})
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-300">Read-Only Audit Trail</h3>
              <p className="text-sm text-blue-400/80 mt-1">All administrative actions are permanently logged. Logs cannot be modified or deleted.</p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
            <div key={key} onClick={() => setF('action', filters.action === key ? 'all' : key)}
              className={`bg-[#161b22] border rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#8b949e] ${filters.action === key ? 'border-[#58a6ff]' : 'border-[#30363d]'}`}>
              <div className="text-2xl font-bold text-[#e6edf3]">{logs.filter(l => l.action === key).length}</div>
              <div className="text-[10px] text-[#8b949e] mt-1 uppercase tracking-wider">{cfg.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={filters.action} onChange={e => setF('action', e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Actions</option>
              <option value="user_ban">User Ban</option>
              <option value="exam_force_stop">Exam Force Stop</option>
              <option value="settings_change">Settings Change</option>
              <option value="rule_change">Rule Change</option>
            </select>

            <select value={filters.admin} onChange={e => setF('admin', e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              {adminOptions.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <select value={filters.dateRange} onChange={e => setF('dateRange', e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 animate-pulse h-28" />
            ))
          ) : filtered.map((log, idx) => {
            const cfg  = ACTION_CONFIG[log.action] || { icon: FileSearch, color: 'text-[#8b949e] bg-[#21262d]', label: log.action };
            const Icon = cfg.icon;
            return (
              <motion.div key={log._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#8b949e] transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#e6edf3]">{cfg.label}</h3>
                        <p className="text-xs text-[#8b949e]">by {log.admin_name}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#8b949e] flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span title={new Date(log.timestamp).toLocaleString('en-IN')}>{timeAgo(log.timestamp)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#8b949e]">Target:</span>
                      <span className="text-xs text-[#e6edf3] font-mono bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">{log.target}</span>
                    </div>

                    <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                      <p className="text-xs text-[#8b949e]">{log.details}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 bg-[#161b22] rounded-xl border border-[#30363d]">
              <FileSearch className="w-12 h-12 text-[#8b949e] mx-auto mb-3" />
              <p className="text-[#8b949e]">No audit logs found for selected filters</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
