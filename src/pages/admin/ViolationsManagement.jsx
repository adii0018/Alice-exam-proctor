import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { AlertTriangle, Download, Eye, Calendar, User, FileText, X, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Mock violations ─────────────────────────────────────────────────────────
const MOCK_VIOLATIONS = [
  { _id: 'v1', violation_type: 'multiple-faces', severity: 'high',     status: 'active',   student_name: 'Arjun Sharma',  exam_title: 'Physics Final Exam',   timestamp: new Date(Date.now()-600000).toISOString(),   metadata: { confidence: 0.92 } },
  { _id: 'v2', violation_type: 'gaze-away',      severity: 'medium',   status: 'resolved', student_name: 'Vikram Singh',  exam_title: 'Biology Unit Test',     timestamp: new Date(Date.now()-1200000).toISOString(),  metadata: { duration: '5s' } },
  { _id: 'v3', violation_type: 'tab-switch',     severity: 'low',      status: 'dismissed',student_name: 'Anjali Verma',  exam_title: 'English Literature Quiz',timestamp: new Date(Date.now()-3600000).toISOString(),  metadata: { count: 2 } },
  { _id: 'v4', violation_type: 'no-face',        severity: 'critical', status: 'active',   student_name: 'Rahul Gupta',   exam_title: 'Mathematics Mid-Term',  timestamp: new Date(Date.now()-7200000).toISOString(),  metadata: { duration: '30s' } },
  { _id: 'v5', violation_type: 'suspicious-object',severity:'medium',  status: 'active',   student_name: 'Kavitha Reddy', exam_title: 'Biology Unit Test',     timestamp: new Date(Date.now()-10800000).toISOString(), metadata: { detected: 'phone' } },
  { _id: 'v6', violation_type: 'multiple-faces', severity: 'high',     status: 'resolved', student_name: 'Vikram Singh',  exam_title: 'Computer Science Exam', timestamp: new Date(Date.now()-86400000).toISOString(), metadata: { confidence: 0.87 } },
  { _id: 'v7', violation_type: 'gaze-away',      severity: 'low',      status: 'active',   student_name: 'Arjun Sharma',  exam_title: 'Chemistry Practical',   timestamp: new Date(Date.now()-172800000).toISOString(),metadata: { duration: '2s' } },
  { _id: 'v8', violation_type: 'tab-switch',     severity: 'medium',   status: 'dismissed',student_name: 'Anjali Verma',  exam_title: 'Physics Final Exam',    timestamp: new Date(Date.now()-259200000).toISOString(),metadata: { count: 1 } },
];

const SEVERITY_STYLE = {
  low:      'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  medium:   'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  high:     'bg-red-500/15 text-red-400 border border-red-500/30',
  critical: 'bg-red-700/30 text-red-300 border border-red-600/50',
};

const STATUS_STYLE = {
  active:    'text-[#f85149]',
  resolved:  'text-[#3fb950]',
  dismissed: 'text-[#8b949e]',
};

const VIOLATION_ICON = {
  'multiple-faces':   '👥',
  'no-face':          '❌',
  'gaze-away':        '👀',
  'tab-switch':       '🔄',
  'suspicious-object':'📱',
};

// ── Date helpers ─────────────────────────────────────────────────────────────
function inDateRange(ts, range) {
  if (range === 'all') return true;
  const d = new Date(ts);
  const now = new Date();
  if (range === 'today') return d.toDateString() === now.toDateString();
  if (range === 'week')  { const w = new Date(now); w.setDate(now.getDate()-7); return d >= w; }
  if (range === 'month') { const m = new Date(now); m.setMonth(now.getMonth()-1); return d >= m; }
  return true;
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
const ViolationDetailModal = ({ v, onClose, onResolve, onDismiss }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-md w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#21262d] transition-colors">
          <X className="w-5 h-5 text-[#8b949e]" />
        </button>

        <div className="text-5xl mb-4 text-center">{VIOLATION_ICON[v.violation_type] || '⚠️'}</div>
        <h3 className="text-xl font-bold text-[#e6edf3] text-center mb-1">
          {v.violation_type?.replace(/-/g, ' ').toUpperCase()}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${SEVERITY_STYLE[v.severity]}`}>{v.severity}</span>
          <span className={`text-sm font-medium capitalize ${STATUS_STYLE[v.status]}`}>● {v.status}</span>
        </div>

        <div className="space-y-2 mb-6">
          {[
            { icon: User,     label: 'Student', value: v.student_name || 'Unknown' },
            { icon: FileText, label: 'Exam',    value: v.exam_title || 'Unknown'   },
            { icon: Calendar, label: 'Time',    value: v.timestamp ? new Date(v.timestamp).toLocaleString('en-IN') : 'N/A' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <Icon size={14} className="text-[#8b949e] flex-shrink-0" />
              <span className="text-xs text-[#8b949e] w-16">{label}</span>
              <span className="text-sm text-[#e6edf3] font-medium">{value}</span>
            </div>
          ))}
          {v.metadata && (
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <p className="text-xs text-[#8b949e] mb-1">Metadata</p>
              <pre className="text-xs text-[#e6edf3] font-mono">{JSON.stringify(v.metadata, null, 2)}</pre>
            </div>
          )}
        </div>

        {v.status === 'active' && (
          <div className="flex gap-2">
            <button onClick={() => onResolve(v)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-900/20 hover:bg-green-900/30 text-[#3fb950] rounded-lg text-sm font-semibold transition-colors">
              <CheckCircle size={14} /> Mark Resolved
            </button>
            <button onClick={() => onDismiss(v)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] rounded-lg text-sm font-semibold transition-colors">
              <XCircle size={14} /> Dismiss
            </button>
          </div>
        )}
      </motion.div>
    </div>
  </AnimatePresence>
);

const ViolationsManagement = () => {
  const [violations, setViolations] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [filters, setFilters]       = useState({ type: 'all', severity: 'all', status: 'all', dateRange: 'all' });
  const [selectedV, setSelectedV]   = useState(null);
  const [showDetail, setDetail]     = useState(false);
  const [loading, setLoading]       = useState(true);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/violations/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setViolations(data.violations?.length ? data.violations : MOCK_VIOLATIONS);
      } else { setViolations(MOCK_VIOLATIONS); }
    } catch { setViolations(MOCK_VIOLATIONS); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchViolations(); }, []);

  useEffect(() => {
    let list = [...violations];
    if (filters.type !== 'all')      list = list.filter(v => v.violation_type === filters.type);
    if (filters.severity !== 'all')  list = list.filter(v => v.severity === filters.severity);
    if (filters.status !== 'all')    list = list.filter(v => v.status === filters.status);
    if (filters.dateRange !== 'all') list = list.filter(v => inDateRange(v.timestamp, filters.dateRange));
    setFiltered(list);
  }, [violations, filters]);

  const updateStatus = (v, newStatus) => {
    setViolations(prev => prev.map(x => x._id === v._id ? { ...x, status: newStatus } : x));
    setDetail(false);
    toast.success(`Violation marked as ${newStatus}.`);
  };

  const openDetail = (v) => { setSelectedV(v); setDetail(true); };

  const exportViolations = () => {
    const rows = [
      ['Timestamp', 'Student', 'Exam', 'Type', 'Severity', 'Status'],
      ...filtered.map(v => [
        new Date(v.timestamp).toLocaleString(),
        v.student_name || 'Unknown', v.exam_title || 'Unknown',
        v.violation_type, v.severity, v.status,
      ]),
    ];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `violations-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} violations!`);
  };

  const setF = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">Violations Management</h1>
            <p className="text-[#8b949e] mt-1">Monitor and manage all proctoring violations</p>
          </div>
          <button onClick={exportViolations}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm">
            <Download className="w-4 h-4" /> Export CSV ({filtered.length})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['low', 'medium', 'high', 'critical'].map(sev => (
            <div key={sev} onClick={() => setF('severity', filters.severity === sev ? 'all' : sev)}
              className={`bg-[#161b22] border rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#8b949e] ${filters.severity === sev ? 'border-[#58a6ff]' : 'border-[#30363d]'}`}>
              <div className="text-2xl font-bold text-[#e6edf3]">{violations.filter(v => v.severity === sev).length}</div>
              <div className="text-xs text-[#8b949e] mt-1 uppercase tracking-wider capitalize">{sev}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'type', opts: [['all','All Types'],['multiple-faces','Multiple Faces'],['no-face','No Face'],['gaze-away','Gaze Away'],['tab-switch','Tab Switch'],['suspicious-object','Suspicious Object']] },
              { key: 'severity', opts: [['all','All Severities'],['low','Low'],['medium','Medium'],['high','High'],['critical','Critical']] },
              { key: 'status', opts: [['all','All Status'],['active','Active'],['resolved','Resolved'],['dismissed','Dismissed']] },
              { key: 'dateRange', opts: [['all','All Time'],['today','Today'],['week','This Week'],['month','This Month']] },
            ].map(({ key, opts }) => (
              <select key={key} value={filters[key]} onChange={e => setF(key, e.target.value)}
                className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
                {opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 animate-pulse h-24" />
            ))
          ) : filtered.map(v => (
            <motion.div key={v._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#8b949e] transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl flex-shrink-0">{VIOLATION_ICON[v.violation_type] || '⚠️'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-bold text-[#e6edf3]">
                      {v.violation_type?.replace(/-/g, ' ').toUpperCase()}
                    </h3>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${SEVERITY_STYLE[v.severity]}`}>{v.severity}</span>
                    <span className={`text-xs font-medium capitalize ${STATUS_STYLE[v.status]}`}>● {v.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#8b949e]">
                    <span className="flex items-center gap-1"><User size={10} /> {v.student_name}</span>
                    <span className="flex items-center gap-1"><FileText size={10} /> {v.exam_title}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(v.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={() => openDetail(v)} title="View Details"
                  className="p-2 rounded-lg hover:bg-[#21262d] transition-colors flex-shrink-0">
                  <Eye className="w-4 h-4 text-[#8b949e] hover:text-[#e6edf3]" />
                </button>
              </div>
            </motion.div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 bg-[#161b22] rounded-xl border border-[#30363d]">
              <AlertTriangle className="w-12 h-12 text-[#8b949e] mx-auto mb-3" />
              <p className="text-[#8b949e]">No violations found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {showDetail && selectedV && (
        <ViolationDetailModal
          v={selectedV}
          onClose={() => setDetail(false)}
          onResolve={(v) => updateStatus(v, 'resolved')}
          onDismiss={(v) => updateStatus(v, 'dismissed')}
        />
      )}
    </AdminLayout>
  );
};

export default ViolationsManagement;
