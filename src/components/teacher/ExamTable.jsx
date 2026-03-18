import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Eye, Edit, Trash2, AlertTriangle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function ExamTable({ exams, onAction }) {
  const { darkMode } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const statusStyle = (status) => {
    if (!darkMode) {
      const map = {
        Draft: { background: '#f3f4f6', color: '#374151' },
        Live: { background: '#dcfce7', color: '#15803d' },
        Completed: { background: '#dbeafe', color: '#1d4ed8' },
        Scheduled: { background: '#f3e8ff', color: '#7e22ce' },
      };
      return map[status] || map.Draft;
    }
    const map = {
      Draft: { background: 'rgba(139,148,158,0.15)', color: '#8b949e' },
      Live: { background: 'rgba(46,160,67,0.15)', color: '#3fb950' },
      Completed: { background: 'rgba(56,139,253,0.15)', color: '#58a6ff' },
      Scheduled: { background: 'rgba(188,140,255,0.15)', color: '#bc8cff' },
    };
    return map[status] || map.Draft;
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onAction('delete', deleteConfirm);
      setDeleteConfirm(null);
    }
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

  const th = {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '0.72rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: darkMode ? '#8b949e' : '#6b7280',
    background: darkMode ? '#161b22' : '#f9fafb',
    borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
  };

  const td = {
    padding: '14px 24px',
    fontSize: '0.875rem',
    color: darkMode ? '#8b949e' : '#374151',
    borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`,
  };

  return (
    <>
      <div style={{
        background: darkMode ? '#161b22' : '#fff',
        border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Exam Name', 'Status', 'Date & Time', 'Duration', 'Students', 'Actions'].map((h, i) => (
                  <th key={h} style={{ ...th, textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  style={{ background: darkMode ? '#161b22' : '#fff', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#1c2128' : '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = darkMode ? '#161b22' : '#fff'}
                >
                  <td style={td}>
                    <div style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827', marginBottom: 4 }}>{exam.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: darkMode ? '#8b949e' : '#6b7280' }}>{exam.code}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={() => copyCode(exam.code)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: darkMode ? '#8b949e' : '#9ca3af', display: 'flex' }}
                        title="Copy code"
                      >
                        {copiedCode === exam.code
                          ? <Check size={13} color="#3fb950" />
                          : <Copy size={13} />}
                      </motion.button>
                    </div>
                  </td>
                  <td style={td}>
                    <span style={{
                      ...statusStyle(exam.status),
                      display: 'inline-flex', alignItems: 'center',
                      padding: '3px 10px', borderRadius: 20,
                      fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {exam.status}
                    </span>
                  </td>
                  <td style={td}>{exam.date}</td>
                  <td style={td}>{exam.duration}</td>
                  <td style={td}>{exam.students}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      {exam.status === 'Live' && (
                        <ActionBtn onClick={() => onAction('view', exam)} title="View Live" color="#58a6ff" darkMode={darkMode}>
                          <Eye size={15} />
                        </ActionBtn>
                      )}
                      {exam.status === 'Draft' && (
                        <ActionBtn onClick={() => onAction('start', exam)} title="Start Exam" color="#3fb950" darkMode={darkMode}>
                          <Play size={15} />
                        </ActionBtn>
                      )}
                      {exam.status === 'Live' && (
                        <ActionBtn onClick={() => onAction('end', exam)} title="End Exam" color="#f0883e" darkMode={darkMode}>
                          <Square size={15} />
                        </ActionBtn>
                      )}
                      <ActionBtn onClick={() => onAction('edit', exam)} title="Edit" color={darkMode ? '#8b949e' : '#6b7280'} darkMode={darkMode}>
                        <Edit size={15} />
                      </ActionBtn>
                      <ActionBtn onClick={() => setDeleteConfirm(exam)} title="Delete" color="#f85149" darkMode={darkMode}>
                        <Trash2 size={15} />
                      </ActionBtn>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {exams.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: darkMode ? '#8b949e' : '#6b7280' }}>
            No exams found
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: darkMode ? '#161b22' : '#fff',
                border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                borderRadius: 16,
                padding: 28,
                maxWidth: 420,
                width: '100%',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(248,81,73,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={22} color="#f85149" />
              </div>
              <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: darkMode ? '#e6edf3' : '#111827', marginBottom: 8 }}>Delete Exam?</h3>
              <p style={{ textAlign: 'center', color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.875rem', marginBottom: 24 }}>
                Are you sure you want to delete <span style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>"{deleteConfirm.name}"</span>? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  style={{ flex: 1, padding: '10px 16px', background: darkMode ? '#21262d' : '#f3f4f6', color: darkMode ? '#e6edf3' : '#374151', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  style={{ flex: 1, padding: '10px 16px', background: '#da3633', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
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
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 7, borderRadius: 6, color,
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
