import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, AlertOctagon, User, ChevronDown, ChevronUp } from 'lucide-react';
import { violationAPI } from '../../utils/api';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

const VIOLATION_LABELS = {
  MULTIPLE_FACES: 'Multiple Faces Detected',
  NO_FACE: 'No Face Detected',
  TAB_SWITCH: 'Tab Switch',
  FULLSCREEN_EXIT: 'Fullscreen Exit',
  SUSPICIOUS_BEHAVIOR: 'Suspicious Behavior',
  LOOKING_AWAY: 'Looking Away',
};

const SEVERITY_CONFIG = {
  low:    { color: '#d2a21a', bg: 'rgba(210,162,26,0.12)', border: 'rgba(210,162,26,0.3)', icon: AlertCircle,   label: 'Low' },
  medium: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)', border: 'rgba(240,136,62,0.3)', icon: AlertTriangle, label: 'Medium' },
  high:   { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  border: 'rgba(248,81,73,0.3)',  icon: AlertOctagon,  label: 'High' },
};

function ViolationBadge({ type, severity }) {
  const sc = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
  const Icon = sc.icon;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: sc.bg, border: `1px solid ${sc.border}`,
      fontSize: 11, fontWeight: 500, color: sc.color,
    }}>
      <Icon size={11} />
      {VIOLATION_LABELS[type] || type}
    </div>
  );
}

function StudentRow({ student, darkMode }) {
  const [expanded, setExpanded] = useState(false);
  const highCount = student.violations.filter(v => v.severity === 'high').length;
  const medCount  = student.violations.filter(v => v.severity === 'medium').length;

  return (
    <div style={{
      border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
      borderRadius: 10, overflow: 'hidden', marginBottom: 10,
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', cursor: 'pointer',
          background: darkMode ? '#161b22' : '#fff',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#1c2128' : '#f9fafb'}
        onMouseLeave={e => e.currentTarget.style.background = darkMode ? '#161b22' : '#fff'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,#f85149,#f0883e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            {student.student_name[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827', fontSize: 14 }}>
              {student.student_name}
            </div>
            <div style={{ fontSize: 12, color: darkMode ? '#8b949e' : '#6b7280', marginTop: 2 }}>
              {student.violations.length} violation{student.violations.length !== 1 ? 's' : ''}
              {highCount > 0 && <span style={{ color: '#f85149', marginLeft: 8 }}>• {highCount} High</span>}
              {medCount > 0 && <span style={{ color: '#f0883e', marginLeft: 8 }}>• {medCount} Medium</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Violation type pills (top 3) */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[...new Set(student.violations.map(v => v.type))].slice(0, 3).map(type => {
              const worst = student.violations
                .filter(v => v.type === type)
                .sort((a, b) => ['high','medium','low'].indexOf(a.severity) - ['high','medium','low'].indexOf(b.severity))[0];
              return <ViolationBadge key={type} type={type} severity={worst?.severity || 'medium'} />;
            })}
          </div>
          {expanded ? <ChevronUp size={16} color={darkMode ? '#8b949e' : '#9ca3af'} /> : <ChevronDown size={16} color={darkMode ? '#8b949e' : '#9ca3af'} />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '12px 16px',
              background: darkMode ? '#0d1117' : '#f9fafb',
              borderTop: `1px solid ${darkMode ? '#21262d' : '#e5e7eb'}`,
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Violation Type', 'Severity', 'Time'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '6px 10px',
                        color: darkMode ? '#8b949e' : '#6b7280',
                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                        borderBottom: `1px solid ${darkMode ? '#21262d' : '#e5e7eb'}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.violations.map((v, i) => {
                    const sc = SEVERITY_CONFIG[v.severity] || SEVERITY_CONFIG.medium;
                    const Icon = sc.icon;
                    return (
                      <tr key={i}>
                        <td style={{ padding: '8px 10px', color: darkMode ? '#e6edf3' : '#111827' }}>
                          {VIOLATION_LABELS[v.type] || v.type}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px', borderRadius: 20,
                            background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 500,
                          }}>
                            <Icon size={10} /> {sc.label}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', color: darkMode ? '#8b949e' : '#6b7280' }}>
                          {new Date(v.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuizViolationsModal({ quiz, onClose }) {
  const { darkMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    violationAPI.getByQuizStudents(quiz.id)
      .then(res => setData(res.data.students || []))
      .catch(() => toast.error('Failed to load violations'))
      .finally(() => setLoading(false));
  }, [quiz.id]);

  const totalViolations = data.reduce((sum, s) => sum + s.violations.length, 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%', maxWidth: 720,
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
          background: darkMode ? '#161b22' : '#fff',
          border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
          borderRadius: 14, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${darkMode ? '#21262d' : '#e5e7eb'}`,
          background: darkMode ? '#0d1117' : '#f9fafb',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#f0883e" />
              <span style={{ fontWeight: 700, fontSize: 16, color: darkMode ? '#e6edf3' : '#111827' }}>
                Violations Report
              </span>
            </div>
            <div style={{ fontSize: 13, color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4 }}>
              {quiz.name} &nbsp;•&nbsp; {data.length} student{data.length !== 1 ? 's' : ''} &nbsp;•&nbsp; {totalViolations} total violations
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6,
            color: darkMode ? '#8b949e' : '#6b7280',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '16px 24px', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: darkMode ? '#8b949e' : '#6b7280' }}>
              Loading...
            </div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <AlertCircle size={40} color={darkMode ? '#3fb950' : '#22c55e'} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: darkMode ? '#8b949e' : '#6b7280', fontWeight: 500 }}>No violations recorded for this exam</p>
            </div>
          ) : (
            data.map(student => (
              <StudentRow key={student.student_id} student={student} darkMode={darkMode} />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
