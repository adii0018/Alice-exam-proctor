import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Eye, Edit, Trash2, AlertTriangle, Copy, Check, Clock, Users, Calendar, ShieldAlert, Power } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import QuizViolationsModal from './QuizViolationsModal';
import ExamDetailsModal from './ExamDetailsModal';

export default function ExamTable({ exams, onAction }) {
  const { darkMode } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [violationsExam, setViolationsExam] = useState(null);
  const [detailsExam, setDetailsExam] = useState(null);

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

  const getStatusColor = (status) => {
    const colors = {
      Draft: darkMode ? { bg: 'rgba(139,148,158,0.15)', text: '#8b949e', border: '#30363d' } : { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
      Live: darkMode ? { bg: 'rgba(46,160,67,0.15)', text: '#3fb950', border: '#2ea043' } : { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
      Completed: darkMode ? { bg: 'rgba(56,139,253,0.15)', text: '#58a6ff', border: '#388bfd' } : { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
      Scheduled: darkMode ? { bg: 'rgba(188,140,255,0.15)', text: '#bc8cff', border: '#a371f7' } : { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },
    };
    return colors[status] || colors.Draft;
  };

  if (exams.length === 0) {
    return (
      <div style={{
        background: darkMode ? '#161b22' : '#fff',
        border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
        borderRadius: 12,
        padding: '64px 24px',
        textAlign: 'center',
        color: darkMode ? '#8b949e' : '#6b7280',
      }}>
        <p style={{ fontSize: '0.95rem', marginBottom: 8 }}>No exams created yet</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Create your first exam to get started</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'grid', gap: 16 }}>
        {exams.map((exam, index) => {
          const statusColor = getStatusColor(exam.status);
          
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setDetailsExam(exam)}
              style={{
                background: darkMode ? '#161b22' : '#fff',
                border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                borderRadius: 12,
                padding: '20px 24px',
                boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = darkMode ? '0 4px 16px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600, 
                      color: darkMode ? '#e6edf3' : '#111827',
                      margin: 0,
                    }}>
                      {exam.name}
                    </h3>
                    <span style={{
                      ...statusColor,
                      background: statusColor.bg,
                      color: statusColor.text,
                      border: `1px solid ${statusColor.border}`,
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}>
                      {exam.status}
                    </span>
                  </div>
                  
                  {/* Exam Code */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontFamily: 'monospace', 
                      color: darkMode ? '#8b949e' : '#6b7280',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>
                      CODE: {exam.code}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyCode(exam.code)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: 4, 
                        color: darkMode ? '#8b949e' : '#9ca3af', 
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Copy code"
                    >
                      {copiedCode === exam.code
                        ? <Check size={14} color="#3fb950" />
                        : <Copy size={14} />}
                    </motion.button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {exam.status === 'Live' && (
                    <ActionBtn onClick={() => onAction('view', exam)} title="View Live" color="#58a6ff" darkMode={darkMode}>
                      <Eye size={16} />
                    </ActionBtn>
                  )}
                  {exam.status === 'Draft' && (
                    <ActionBtn onClick={() => onAction('start', exam)} title="Start Exam" color="#3fb950" darkMode={darkMode}>
                      <Play size={16} />
                    </ActionBtn>
                  )}
                  {exam.status === 'Live' && (
                    <ActionBtn onClick={() => onAction('end', exam)} title="End Exam" color="#f0883e" darkMode={darkMode}>
                      <Square size={16} />
                    </ActionBtn>
                  )}
                  <ActionBtn onClick={() => setViolationsExam(exam)} title="View Violations" color="#f85149" darkMode={darkMode}>
                    <ShieldAlert size={16} />
                  </ActionBtn>
                  <ActionBtn onClick={() => onAction('edit', exam)} title="Edit" color={darkMode ? '#8b949e' : '#6b7280'} darkMode={darkMode}>
                    <Edit size={16} />
                  </ActionBtn>
                  <ActionBtn onClick={() => setDeleteConfirm(exam)} title="Delete" color="#f85149" darkMode={darkMode}>
                    <Trash2 size={16} />
                  </ActionBtn>
                </div>
              </div>

              {/* Info Row */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <InfoItem 
                  icon={<Calendar size={14} />} 
                  label="Scheduled" 
                  value={exam.date} 
                  darkMode={darkMode} 
                />
                <InfoItem 
                  icon={<Clock size={14} />} 
                  label="Duration" 
                  value={exam.duration} 
                  darkMode={darkMode} 
                />
                <InfoItem 
                  icon={<Users size={14} />} 
                  label="Students" 
                  value={exam.students} 
                  darkMode={darkMode} 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    textTransform: 'uppercase', 
                    color: darkMode ? '#8b949e' : '#6b7280',
                    letterSpacing: '0.05em',
                  }}>
                    Status:
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction('toggle_active', exam)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: exam.is_active 
                        ? (darkMode ? 'rgba(46,160,67,0.15)' : '#dcfce7')
                        : (darkMode ? '#21262d' : '#f3f4f6'),
                      border: `1.5px solid ${exam.is_active 
                        ? (darkMode ? '#2ea043' : '#16a34a')
                        : (darkMode ? '#30363d' : '#d1d5db')}`,
                      color: exam.is_active ? (darkMode ? '#3fb950' : '#15803d') : (darkMode ? '#8b949e' : '#6b7280'),
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: exam.is_active 
                        ? (darkMode ? '0 0 12px rgba(46,160,67,0.2)' : '0 0 8px rgba(22,163,74,0.15)')
                        : 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = exam.is_active
                        ? (darkMode ? '0 0 16px rgba(46,160,67,0.3)' : '0 0 12px rgba(22,163,74,0.25)')
                        : (darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)');
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = exam.is_active
                        ? (darkMode ? '0 0 12px rgba(46,160,67,0.2)' : '0 0 8px rgba(22,163,74,0.15)')
                        : 'none';
                    }}
                  >
                    <Power size={14} strokeWidth={2.5} />
                    {exam.is_active ? 'Active' : 'Inactive'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Exam Details Modal */}
      <AnimatePresence>
        {detailsExam && (
          <ExamDetailsModal exam={detailsExam} onClose={() => setDetailsExam(null)} />
        )}
      </AnimatePresence>

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
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.6)', 
              backdropFilter: 'blur(4px)', 
              zIndex: 50, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 16 
            }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
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
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                background: 'rgba(248,81,73,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}>
                <AlertTriangle size={22} color="#f85149" />
              </div>
              <h3 style={{ 
                textAlign: 'center', 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                color: darkMode ? '#e6edf3' : '#111827', 
                marginBottom: 8 
              }}>
                Delete Exam?
              </h3>
              <p style={{ 
                textAlign: 'center', 
                color: darkMode ? '#8b949e' : '#6b7280', 
                fontSize: '0.875rem', 
                marginBottom: 24 
              }}>
                Are you sure you want to delete <span style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>"{deleteConfirm.name}"</span>? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  style={{ 
                    flex: 1, 
                    padding: '10px 16px', 
                    background: darkMode ? '#21262d' : '#f3f4f6', 
                    color: darkMode ? '#e6edf3' : '#374151', 
                    border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, 
                    borderRadius: 8, 
                    fontWeight: 500, 
                    cursor: 'pointer', 
                    fontSize: '0.875rem' 
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  style={{ 
                    flex: 1, 
                    padding: '10px 16px', 
                    background: '#da3633', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    fontSize: '0.875rem' 
                  }}
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
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={title}
      style={{
        background: darkMode ? '#21262d' : '#f3f4f6',
        border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
        cursor: 'pointer',
        padding: 8,
        borderRadius: 8,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = darkMode ? '#30363d' : '#e5e7eb';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = darkMode ? '#21262d' : '#f3f4f6';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </motion.button>
  );
}

function InfoItem({ icon, label, value, darkMode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>
        {icon}
      </div>
      <div>
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          color: darkMode ? '#8b949e' : '#6b7280',
          letterSpacing: '0.05em',
          marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: 500, 
          color: darkMode ? '#e6edf3' : '#111827' 
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}
