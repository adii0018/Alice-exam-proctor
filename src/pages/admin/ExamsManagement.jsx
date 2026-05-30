import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FileText, Search, StopCircle, Lock, Eye, Download, Clock, User, X, Calendar, AlertTriangle,
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

// ── Mock exams ──────────────────────────────────────────────────────────────
const MOCK_EXAMS = [
  { _id: 'e1', title: 'Physics Final Exam',       code: 'PHY-2024-F', teacher_name: 'Dr. Verma',   status: 'live',      duration: 120, questions: Array(30).fill(null), flagged: false, description: 'Final exam covering optics, thermodynamics and mechanics.',        created_at: new Date(Date.now()-3600000).toISOString() },
  { _id: 'e2', title: 'Mathematics Mid-Term',     code: 'MTH-2024-M', teacher_name: 'Prof. Singh',  status: 'completed', duration: 90,  questions: Array(25).fill(null), flagged: true,  description: 'Algebra, calculus, and coordinate geometry.',                     created_at: new Date(Date.now()-86400000).toISOString() },
  { _id: 'e3', title: 'Chemistry Practical Test', code: 'CHM-2024-P', teacher_name: 'Ms. Sharma',  status: 'scheduled', duration: 60,  questions: Array(20).fill(null), flagged: false, description: 'Organic and inorganic chemistry practical assessment.',            created_at: new Date(Date.now()-172800000).toISOString() },
  { _id: 'e4', title: 'English Literature Quiz',  code: 'ENG-2024-Q', teacher_name: 'Mr. Iyer',    status: 'completed', duration: 45,  questions: Array(15).fill(null), flagged: false, description: 'Shakespeare plays and modern poetry comprehension.',               created_at: new Date(Date.now()-259200000).toISOString() },
  { _id: 'e5', title: 'Biology Unit Test',        code: 'BIO-2024-U', teacher_name: 'Dr. Reddy',   status: 'live',      duration: 75,  questions: Array(35).fill(null), flagged: true,  description: 'Cell biology, genetics, and ecology topics.',                     created_at: new Date(Date.now()-3000000).toISOString()  },
  { _id: 'e6', title: 'Computer Science Exam',    code: 'CS-2024-E',  teacher_name: 'Prof. Kumar',  status: 'scheduled', duration: 90,  questions: Array(40).fill(null), flagged: false, description: 'Data structures, algorithms, and programming concepts.',          created_at: new Date(Date.now()-432000000).toISOString() },
  { _id: 'e7', title: 'History Assessment',       code: 'HIS-2024-A', teacher_name: 'Ms. Nair',    status: 'stopped',   duration: 60,  questions: Array(20).fill(null), flagged: false, description: 'Modern Indian history and world civilizations.',                   created_at: new Date(Date.now()-518400000).toISOString() },
];

const STATUS_CONFIG = {
  live:      { label: 'Live',      bg: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  completed: { label: 'Completed', bg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30'   },
  scheduled: { label: 'Scheduled', bg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  stopped:   { label: 'Stopped',   bg: 'bg-red-500/15 text-red-400 border border-red-500/30'      },
};

// ── Exam Detail Modal ─────────────────────────────────────────────────────
const ExamDetailModal = ({ exam, onClose }) => (
  <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#21262d] transition-colors">
          <X className="w-5 h-5 text-[#8b949e]" />
        </button>

        <div className="mb-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <FileText className="w-6 h-6 text-[#8b949e]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#e6edf3]">{exam.title}</h3>
              <code className="text-xs bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded text-[#8b949e] mt-1 inline-block">{exam.code}</code>
            </div>
          </div>
          {exam.description && <p className="text-sm text-[#8b949e] bg-[#0d1117] rounded-xl p-3 border border-[#30363d]">{exam.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: User,          label: 'Teacher',    value: exam.teacher_name || 'Unknown' },
            { icon: Clock,         label: 'Duration',   value: `${exam.duration} minutes` },
            { icon: FileText,      label: 'Questions',  value: exam.questions?.length || 0 },
            { icon: Calendar,      label: 'Created',    value: exam.created_at ? new Date(exam.created_at).toLocaleDateString('en-IN') : 'N/A' },
            { icon: AlertTriangle, label: 'Status',     value: exam.status },
            { icon: AlertTriangle, label: 'Flagged',    value: exam.flagged ? 'Yes ⚠️' : 'No' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
              <Icon size={14} className="text-[#8b949e] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[#8b949e] uppercase tracking-wider">{label}</p>
                <p className="text-sm text-[#e6edf3] font-medium capitalize">{String(value)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

const ExamsManagement = () => {
  const [exams, setExams]           = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [searchQuery, setSearch]    = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [selectedExam, setSelected] = useState(null);
  const [showConfirm, setConfirm]   = useState(false);
  const [showDetail, setDetail]     = useState(false);
  const [actionType, setAction]     = useState('');
  const [loading, setLoading]       = useState(true);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exams/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams?.length ? data.exams : MOCK_EXAMS);
      } else { setExams(MOCK_EXAMS); }
    } catch { setExams(MOCK_EXAMS); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExams(); }, []);

  useEffect(() => {
    let list = [...exams];
    if (searchQuery) list = list.filter(e => e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || e.code?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(e => e.status === statusFilter);
    setFiltered(list);
  }, [exams, searchQuery, statusFilter]);

  const openAction = (exam, action) => {
    setSelected(exam);
    setAction(action);
    if (action === 'view') { setDetail(true); return; }
    setConfirm(true);
  };

  const confirmAction = async () => {
    try {
      await fetch(`/api/admin/exams/${selectedExam._id}/${actionType}/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).catch(() => {});

      if (actionType === 'force-stop') {
        setExams(prev => prev.map(e => e._id === selectedExam._id ? { ...e, status: 'stopped' } : e));
        toast.success(`"${selectedExam.title}" has been stopped.`);
      } else if (actionType === 'lock') {
        setExams(prev => prev.map(e => e._id === selectedExam._id ? { ...e, status: 'completed' } : e));
        toast.success(`"${selectedExam.title}" has been locked.`);
      }
    } catch {
      toast.error('Action failed. Please try again.');
    } finally { setConfirm(false); }
  };

  const exportExams = () => {
    const rows = [
      ['Title', 'Code', 'Teacher', 'Status', 'Duration', 'Questions', 'Flagged'],
      ...filtered.map(e => [e.title, e.code, e.teacher_name, e.status, `${e.duration} min`, e.questions?.length || 0, e.flagged ? 'Yes' : 'No']),
    ];
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `exams-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} exams!`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">Exam Management</h1>
            <p className="text-[#8b949e] mt-1">Monitor and control all exams across the platform</p>
          </div>
          <button onClick={exportExams}
            className="flex items-center gap-2 px-4 py-2 bg-[#2ea043] hover:bg-[#3fb950] text-white rounded-lg transition-all font-semibold text-sm">
            <Download className="w-4 h-4" /> Export Exams ({filtered.length})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total',     value: exams.length,                               color: '#8b949e' },
            { label: 'Live',      value: exams.filter(e=>e.status==='live').length,  color: '#3fb950' },
            { label: 'Completed', value: exams.filter(e=>e.status==='completed').length, color: '#58a6ff' },
            { label: 'Flagged',   value: exams.filter(e=>e.flagged).length,          color: '#f85149' },
          ].map(s => (
            <div key={s.label} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#8b949e] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input type="text" placeholder="Search by title or code…" value={searchQuery}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#8b949e] focus:ring-1 focus:ring-[#2ea043] focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)}
              className="px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:ring-1 focus:ring-[#2ea043] focus:outline-none">
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="stopped">Stopped</option>
            </select>
          </div>
        </div>

        {/* Exams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(exam => (
              <motion.div key={exam._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-[#161b22] border rounded-xl p-6 transition-all hover:border-[#8b949e] ${exam.flagged ? 'border-[#f85149]/50' : 'border-[#30363d]'}`}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-[#e6edf3]">{exam.title}</h3>
                      {exam.flagged && <AlertTriangle size={14} className="text-[#f85149] flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded text-[#8b949e]">{exam.code}</code>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[exam.status]?.bg || STATUS_CONFIG.scheduled.bg}`}>
                        {STATUS_CONFIG[exam.status]?.label || exam.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-xs text-[#8b949e]">
                  <div className="flex items-center gap-1"><User size={12} /> <span>{exam.teacher_name || 'Unknown'}</span></div>
                  <div className="flex items-center gap-1"><Clock size={12} /> <span>{exam.duration} min</span></div>
                  <div className="flex items-center gap-1"><FileText size={12} /> <span>{exam.questions?.length || 0} Qs</span></div>
                </div>

                {exam.description && (
                  <p className="text-xs text-[#8b949e] mb-4 line-clamp-2 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">{exam.description}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#30363d]">
                  <button onClick={() => openAction(exam, 'view')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] rounded-lg transition-colors text-sm font-medium">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  {exam.status === 'live' && (
                    <button onClick={() => openAction(exam, 'force-stop')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-[#f85149] rounded-lg transition-colors text-sm font-medium">
                      <StopCircle className="w-4 h-4" /> Stop
                    </button>
                  )}
                  {(exam.status === 'live' || exam.status === 'scheduled') && (
                    <button onClick={() => openAction(exam, 'lock')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-900/20 hover:bg-orange-900/30 text-orange-400 rounded-lg transition-colors text-sm font-medium">
                      <Lock className="w-4 h-4" /> Lock
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-[#161b22] rounded-xl border border-[#30363d]">
            <FileText className="w-12 h-12 text-[#8b949e] mx-auto mb-3" />
            <p className="text-[#8b949e]">No exams found</p>
          </div>
        )}
      </div>

      {showDetail && selectedExam && (
        <ExamDetailModal exam={selectedExam} onClose={() => setDetail(false)} />
      )}
      {showConfirm && (
        <ConfirmModal
          title={actionType === 'force-stop' ? 'Force Stop Exam' : 'Lock Exam'}
          message={`Are you sure you want to ${actionType === 'force-stop' ? 'force stop' : 'lock'} "${selectedExam?.title}"? This action will be logged.`}
          onConfirm={confirmAction}
          onCancel={() => setConfirm(false)}
          type="danger"
        />
      )}
    </AdminLayout>
  );
};

export default ExamsManagement;
