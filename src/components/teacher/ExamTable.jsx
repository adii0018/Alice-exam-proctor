import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, Eye, Edit, Trash2, AlertTriangle, Copy, Check,
  ToggleLeft, ToggleRight, ShieldAlert, BookOpen, Clock, Users,
  Search, Zap, Calendar
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import QuizViolationsModal from './QuizViolationsModal';

export default function ExamTable({ exams, onAction }) {
  const { darkMode } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [violationsExam, setViolationsExam] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statusConfig = {
    Draft:     { bg: darkMode ? 'rgba(139,148,158,0.12)' : '#f3f4f6',   color: darkMode ? '#8b949e' : '#374151', dot: '#8b949e' },
    Live:      { bg: darkMode ? 'rgba(46,160,67,0.12)'  : '#dcfce7',   color: darkMode ? '#3fb950' : '#15803d', dot: '#3fb950' },
    Completed: { bg: darkMode ? 'rgba(56,139,253,0.12)' : '#dbeafe',   color: darkMode ? '#58a6ff' : '#1d4ed8', dot: '#58a6ff' },
    Scheduled: { bg: darkMode ? 'rgba(188,140,255,0.12)': '#f3e8ff',   color: darkMode ? '#bc8cff' : '#7e22ce', dot: '#bc8cff' },
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const filtered = exams.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const statuses = ['All', 'Live', 'Draft', 'Completed', 'Scheduled'];

  const surface  = darkMode ? '#161b22' : '#ffffff';
  const border   = darkMode ? '#30363d' : '#e5e7eb';
  const subtext  = darkMode ? '#8b949e' : '#6b7280';
  const heading  = darkMode ? '#e6edf3' : '#111827';
  const cardHover= darkMode ? '#1c2128' : '#f9fafb';

  return (
    <>
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)' }}>

        {/* ── Header ── */}
        <div style={{ padding: '24px 24px 0', borderBottom: `1px solid ${border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: darkMode ? 'rgba(56,139,253,0.12)' : '#ecfdf5',
                border: `1px solid ${darkMode ? 'rgba(56,139,253,0.25)' : '#a7f3d0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <BookOpen size={20} color={darkMode ? '#58a6ff' : '#059669'} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: heading, margin: 0, lineHeight: 1.3 }}>
                  Exam Management
                </h2>
                <p style={{ fontSize: '0.8rem', color: subtext, margin: 0, marginTop: 2 }}>
                  Create and manage your exams
                </p>
              </div>
            </div>


          </div>

          {/* ── Filters row ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingBottom: 16 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
              <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: subtext, pointerEvents: 'none' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search exams..."
                style={{
                  width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  background: darkMode ? '#0d1117' : '#f9fafb',
                  border: `1px solid ${border}`, borderRadius: 8,
                  color: heading, fontSize: '0.82rem', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Status pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {statuses.map(s => (
                <motion.button
                  key={s} whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                    background: filterStatus === s
                      ? (darkMode ? '#388bfd' : '#059669')
                      : (darkMode ? '#21262d' : '#f3f4f6'),
                    color: filterStatus === s ? '#fff' : subtext,
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Summary bar ── */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: `1px solid ${border}`,
          background: darkMode ? '#0d1117' : '#f9fafb',
        }}>
          {[
            { label: 'Total', value: exams.length, color: darkMode ? '#58a6ff' : '#2563eb' },
            { label: 'Live', value: exams.filter(e => e.status === 'Live').length, color: '#3fb950' },
            { label: 'Draft', value: exams.filter(e => e.status === 'Draft').length, color: subtext },
            { label: 'Showing', value: filtered.length, color: darkMode ? '#bc8cff' : '#7e22ce' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              flex: 1, padding: '10px 16px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? `1px solid ${border}` : 'none',
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '0.7rem', color: subtext, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── Cards ── */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '48px 24px', color: subtext }}
              >
                <BookOpen size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ margin: 0, fontWeight: 500 }}>No exams found</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Try adjusting your search or filter</p>
              </motion.div>
            ) : (
              filtered.map((exam, index) => {
                const sc = statusConfig[exam.status] || statusConfig.Draft;
                return (
                  <motion.div
                    key={exam.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: index * 0.04 }}
                    style={{
                      background: darkMode ? '#0d1117' : '#fff',
                      border: `1px solid ${border}`,
                      borderRadius: 12,
                      padding: '16px 18px',
                      cursor: 'default',
                      transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = cardHover;
                      e.currentTarget.style.borderColor = darkMode ? '#388bfd40' : '#bfdbfe';
                      e.currentTarget.style.boxShadow = darkMode ? '0 4px 16px rgba(56,139,253,0.08)' : '0 4px 16px rgba(37,99,235,0.07)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = darkMode ? '#0d1117' : '#fff';
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Row 1: name + status + actions */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>
                            {exam.name}
                          </span>
                          {/* Status badge */}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.72rem', fontWeight: 700,
                            background: sc.bg, color: sc.color,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, display: 'inline-block', ...(exam.status === 'Live' ? { animation: 'pulse 1.5s infinite' } : {}) }} />
                            {exam.status}
                          </span>
                          {/* Active toggle inline */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onAction('toggle_active', exam)}
                            title={exam.is_active ? 'Deactivate' : 'Activate'}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                          >
                            {exam.is_active
                              ? <ToggleRight size={22} color="#3fb950" />
                              : <ToggleLeft size={22} color={subtext} />}
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: exam.is_active ? '#3fb950' : subtext }}>
                              {exam.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </motion.button>
                        </div>

                        {/* Code */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                          <span style={{ fontSize: '0.72rem', color: subtext }}>Code:</span>
                          <span style={{
                            fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700,
                            color: darkMode ? '#58a6ff' : '#2563eb',
                            background: darkMode ? 'rgba(56,139,253,0.1)' : '#eff6ff',
                            padding: '2px 8px', borderRadius: 6,
                            border: `1px solid ${darkMode ? 'rgba(56,139,253,0.2)' : '#bfdbfe'}`,
                            letterSpacing: '0.08em',
                          }}>
                            {exam.code}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => copyCode(exam.code)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: subtext, display: 'flex' }}
                            title="Copy code"
                          >
                            {copiedCode === exam.code ? <Check size={13} color="#3fb950" /> : <Copy size={13} />}
                          </motion.button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        {exam.status === 'Live' && (
                          <ActionBtn onClick={() => onAction('view', exam)} title="View Live" color="#58a6ff" darkMode={darkMode}>
                            <Eye size={14} />
                          </ActionBtn>
                        )}
                        {exam.status === 'Draft' && (
                          <ActionBtn onClick={() => onAction('start', exam)} title="Start Exam" color="#3fb950" darkMode={darkMode}>
                            <Play size={14} />
                          </ActionBtn>
                        )}
                        {exam.status === 'Live' && (
                          <ActionBtn onClick={() => onAction('end', exam)} title="End Exam" color="#f0883e" darkMode={darkMode}>
                            <Square size={14} />
                          </ActionBtn>
                        )}
                        <ActionBtn onClick={() => setViolationsExam(exam)} title="Violations" color="#f85149" darkMode={darkMode}>
                          <ShieldAlert size={14} />
                        </ActionBtn>
                        <ActionBtn onClick={() => onAction('edit', exam)} title="Edit" color={subtext} darkMode={darkMode}>
                          <Edit size={14} />
                        </ActionBtn>
                        <ActionBtn onClick={() => setDeleteConfirm(exam)} title="Delete" color="#f85149" darkMode={darkMode}>
                          <Trash2 size={14} />
                        </ActionBtn>
                      </div>
                    </div>

                    {/* Row 2: meta chips */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <MetaChip icon={<Clock size={12} />} label={exam.duration} darkMode={darkMode} />
                      <MetaChip icon={<Users size={12} />} label={
                        exam.max_students > 0
                          ? `${exam.students} / ${exam.max_students} students`
                          : `${exam.students} students`
                      } darkMode={darkMode} accent={exam.max_students > 0 && exam.students >= exam.max_students ? '#f85149' : null} />
                      <MetaChip icon={<Calendar size={12} />} label={exam.date || 'No date'} darkMode={darkMode} />
                      {exam.max_students > 0 && exam.students < exam.max_students && (
                        <MetaChip icon={<Zap size={12} />} label={`${exam.max_students - exam.students} seats left`} darkMode={darkMode} accent="#3fb950" />
                      )}
                      {exam.max_students > 0 && exam.students >= exam.max_students && (
                        <MetaChip icon={null} label="🔒 Full" darkMode={darkMode} accent="#f85149" />
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        {filtered.length > 0 && (
          <div style={{
            padding: '12px 20px',
            borderTop: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: darkMode ? '#0d1117' : '#f9fafb',
          }}>
            <span style={{ fontSize: '0.78rem', color: subtext }}>
              Showing {filtered.length} of {exams.length} exams
            </span>
            <motion.a
              whileHover={{ x: 3 }}
              href="/teacher/exams"
              style={{ fontSize: '0.78rem', color: darkMode ? '#58a6ff' : '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              View all →
            </motion.a>
          </div>
        )}
      </div>

      {/* pulse keyframe */}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Violations Modal */}
      <AnimatePresence>
        {violationsExam && (
          <QuizViolationsModal quiz={violationsExam} onClose={() => setViolationsExam(null)} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: darkMode ? '#161b22' : '#fff',
                border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                borderRadius: 18, padding: 32, maxWidth: 420, width: '100%',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <AlertTriangle size={24} color="#f85149" />
              </div>
              <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: darkMode ? '#e6edf3' : '#111827', marginBottom: 8 }}>Delete Exam?</h3>
              <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.875rem', marginBottom: 26, lineHeight: 1.6 }}>
                Are you sure you want to delete{' '}
                <span style={{ fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>"{deleteConfirm.name}"</span>?
                {' '}This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  style={{ flex: 1, padding: '11px 16px', background: darkMode ? '#21262d' : '#f3f4f6', color: darkMode ? '#e6edf3' : '#374151', border: `1px solid ${border}`, borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { onAction('delete', deleteConfirm); setDeleteConfirm(null); }}
                  style={{ flex: 1, padding: '11px 16px', background: 'linear-gradient(135deg,#da3633,#f85149)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(248,81,73,0.35)' }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ActionBtn({ onClick, title, color, darkMode, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
      onClick={onClick} title={title}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 7, borderRadius: 8, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#21262d' : '#f3f4f6'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </motion.button>
  );
}

function MetaChip({ icon, label, darkMode, accent }) {
  const subtext = darkMode ? '#8b949e' : '#6b7280';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 8,
      fontSize: '0.72rem', fontWeight: 500,
      background: darkMode ? '#161b22' : '#f3f4f6',
      border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
      color: accent || subtext,
    }}>
      {icon}
      {label}
    </span>
  );
}
