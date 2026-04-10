import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, AlertTriangle, AlertCircle, AlertOctagon, ChevronDown, ChevronUp,
  Eye, EyeOff, MonitorOff, Volume2, Users, Maximize, Brain,
  Shield, Clock, Info,
} from 'lucide-react';
import { violationAPI } from '../../utils/api';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';

/* ─── Violation type human-readable info ─── */
const V_INFO = {
  MULTIPLE_FACES: {
    label: 'Multiple Faces Detected',
    icon: Users,
    color: '#f85149',
    description: 'Camera detected more than one face — possible use of external help during exam.',
  },
  NO_FACE: {
    label: 'No Face Detected',
    icon: EyeOff,
    color: '#f0883e',
    description: 'Student\'s face was not visible — likely stepped away from camera.',
  },
  TAB_SWITCH: {
    label: 'Tab / Window Switch',
    icon: MonitorOff,
    color: '#d2a21a',
    description: 'Student switched to another browser tab or window during the exam.',
  },
  FULLSCREEN_EXIT: {
    label: 'Fullscreen Exit',
    icon: Maximize,
    color: '#d2a21a',
    description: 'Student exited fullscreen mode, potentially browsing other content.',
  },
  SUSPICIOUS_BEHAVIOR: {
    label: 'Suspicious Behavior',
    icon: Brain,
    color: '#a371f7',
    description: 'AI proctoring flagged unusual activity that could indicate cheating.',
  },
  LOOKING_AWAY: {
    label: 'Looking Away',
    icon: Eye,
    color: '#f0883e',
    description: 'Student was repeatedly looking away from the screen.',
  },
  VOICE_DETECTED: {
    label: 'Voice / Sound Detected',
    icon: Volume2,
    color: '#f0883e',
    description: 'Suspicious audio detected — student may be talking to someone.',
  },
};

const SEV_META = {
  high:   { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  border: 'rgba(248,81,73,0.3)',  icon: AlertOctagon,  label: 'High'   },
  medium: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)', border: 'rgba(240,136,62,0.3)', icon: AlertTriangle, label: 'Medium' },
  low:    { color: '#d2a21a', bg: 'rgba(210,162,26,0.12)', border: 'rgba(210,162,26,0.3)', icon: AlertCircle,   label: 'Low'    },
};

/* ─── Single violation detail row ─── */
function ViolationRow({ v, darkMode, index }) {
  const info = V_INFO[v.type] || {
    label: v.type, icon: AlertTriangle, color: '#8b949e',
    description: 'An unrecognized proctoring violation was recorded.',
  };
  const sev   = SEV_META[v.severity] || SEV_META.medium;
  const Icon  = info.icon;
  const SIcon = sev.icon;

  const metaEntries = v.metadata ? Object.entries(v.metadata).filter(([, val]) => val !== null && val !== undefined && val !== '') : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{
        background: darkMode ? '#0d1117' : '#fafafa',
        border: `1px solid ${darkMode ? '#21262d' : '#e5e7eb'}`,
        borderLeft: `3px solid ${info.color}`,
        borderRadius: 10, padding: '13px 16px', marginBottom: 8,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: `${info.color}18`, border: `1px solid ${info.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={info.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type + severity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: darkMode ? '#e6edf3' : '#111827' }}>
              {info.label}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 20,
              background: sev.bg, border: `1px solid ${sev.border}`,
              fontSize: 10, fontWeight: 700, color: sev.color, letterSpacing: '0.03em',
            }}>
              <SIcon size={9} /> {sev.label.toUpperCase()}
            </span>
            {v.face_count > 1 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 20,
                background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)',
                fontSize: 10, fontWeight: 600, color: '#f85149',
              }}>
                👥 {v.face_count} faces
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ margin: '0 0 6px', fontSize: 12, color: darkMode ? '#8b949e' : '#6b7280', lineHeight: 1.5 }}>
            {info.description}
          </p>

          {/* Timestamp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: darkMode ? '#484f58' : '#9ca3af' }}>
            <Clock size={11} />
            {new Date(v.timestamp).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
            })}
          </div>

          {/* Metadata pills */}
          {metaEntries.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {metaEntries.map(([k, val]) => (
                <span key={k} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 9999,
                  background: darkMode ? '#21262d' : '#f3f4f6',
                  border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                  color: darkMode ? '#8b949e' : '#6b7280',
                  fontFamily: 'monospace',
                }}>
                  {k}: <strong>{String(val)}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Student accordion row ─── */
function StudentAccordion({ student, darkMode, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);

  const highCount   = student.violations.filter(v => v.severity === 'high').length;
  const medCount    = student.violations.filter(v => v.severity === 'medium').length;
  const lowCount    = student.violations.filter(v => v.severity === 'low').length;
  const riskScore   = highCount * 3 + medCount * 1.5 + lowCount * 0.5;
  const riskLabel   = riskScore >= 6 ? 'Critical' : riskScore >= 3 ? 'High' : riskScore >= 1.5 ? 'Medium' : 'Low';
  const riskColor   = { Critical: '#f85149', High: '#f0883e', Medium: '#d2a21a', Low: '#3fb950' }[riskLabel];

  const surface = darkMode ? '#161b22' : '#fff';
  const border  = darkMode ? '#30363d' : '#e5e7eb';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const subtext = darkMode ? '#8b949e' : '#6b7280';

  return (
    <div style={{ border: `1px solid ${highCount > 0 ? 'rgba(248,81,73,0.35)' : border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header — click to expand */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', cursor: 'pointer',
          background: open ? (darkMode ? '#1c2128' : '#f9fafb') : surface,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#1c2128' : '#f9fafb'}
        onMouseLeave={e => e.currentTarget.style.background = open ? (darkMode ? '#1c2128' : '#f9fafb') : surface}
      >
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${riskColor}cc, ${riskColor}66)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
          }}>
            {student.student_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: heading }}>
              {student.student_name}
            </div>
            <div style={{ fontSize: 12, color: subtext, marginTop: 2, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span>{student.violations.length} violation{student.violations.length !== 1 ? 's' : ''}</span>
              {highCount > 0   && <span style={{ color: '#f85149' }}>• {highCount} High</span>}
              {medCount > 0    && <span style={{ color: '#f0883e' }}>• {medCount} Medium</span>}
              {lowCount > 0    && <span style={{ color: '#d2a21a' }}>• {lowCount} Low</span>}
            </div>
          </div>
        </div>

        {/* Right: risk badge + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 9999,
            background: `${riskColor}20`, border: `1px solid ${riskColor}50`,
            color: riskColor, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {riskLabel} Risk
          </span>
          {open
            ? <ChevronUp size={16} color={subtext} />
            : <ChevronDown size={16} color={subtext} />
          }
        </div>
      </div>

      {/* Expanded violations list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '14px 18px 6px',
              background: darkMode ? '#0d1117' : '#f9fafb',
              borderTop: `1px solid ${border}`,
            }}>
              {student.violations
                .slice()
                .sort((a, b) => {
                  const order = { high: 0, medium: 1, low: 2 };
                  return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
                })
                .map((v, i) => (
                  <ViolationRow key={i} v={v} darkMode={darkMode} index={i} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Modal ─── */
export default function QuizViolationsModal({ quiz, onClose }) {
  const { darkMode } = useTheme();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [sevFilter, setSevFilter] = useState('all');

  useEffect(() => {
    violationAPI.getByQuizStudents(quiz.id)
      .then(res => setData(res.data.students || []))
      .catch(() => toast.error('Failed to load violation details'))
      .finally(() => setLoading(false));
  }, [quiz.id]);

  const totalViolations = data.reduce((sum, s) => sum + s.violations.length, 0);
  const highTotal  = data.reduce((sum, s) => sum + s.violations.filter(v => v.severity === 'high').length, 0);
  const medTotal   = data.reduce((sum, s) => sum + s.violations.filter(v => v.severity === 'medium').length, 0);

  /* Filter students by severity */
  const filtered = sevFilter === 'all'
    ? data
    : data.filter(s => s.violations.some(v => v.severity === sevFilter));

  const surface = darkMode ? '#161b22' : '#fff';
  const border  = darkMode ? '#30363d' : '#e5e7eb';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const subtext = darkMode ? '#8b949e' : '#6b7280';
  const panelBg = darkMode ? '#0d1117' : '#f9fafb';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          width: '100%', maxWidth: 760,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: '18px 24px',
          background: panelBg,
          borderBottom: `1px solid ${border}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={18} color="#f85149" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: heading }}>
                  Violation Report
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: subtext, marginTop: 1 }}>
                  {quiz.name}
                </p>
              </div>
            </div>

            {/* Summary chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: `${data.length} student${data.length !== 1 ? 's' : ''}`, color: '#3b82f6' },
                { label: `${totalViolations} total violations`, color: '#f0883e' },
                highTotal > 0 && { label: `${highTotal} High severity`, color: '#f85149' },
              ].filter(Boolean).map((chip, i) => (
                <span key={i} style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
                  background: `${chip.color}15`, border: `1px solid ${chip.color}35`, color: chip.color,
                }}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background: darkMode ? '#21262d' : '#f3f4f6',
              border: `1px solid ${border}`, borderRadius: 8,
              padding: '6px 8px', cursor: 'pointer', color: subtext,
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Severity filter bar ── */}
        {!loading && data.length > 0 && (
          <div style={{
            padding: '10px 24px',
            background: panelBg, borderBottom: `1px solid ${border}`,
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: subtext, marginRight: 4 }}>Filter:</span>
            {['all', 'high', 'medium', 'low'].map(level => {
              const active = sevFilter === level;
              const col = level === 'all' ? '#3b82f6' : SEV_META[level]?.color;
              const count = level === 'all' ? data.length
                : data.filter(s => s.violations.some(v => v.severity === level)).length;
              return (
                <button
                  key={level}
                  onClick={() => setSevFilter(level)}
                  style={{
                    padding: '5px 12px', borderRadius: 9999, fontSize: 11,
                    fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? col : border}`,
                    background: active ? `${col}20` : (darkMode ? '#21262d' : '#f9fafb'),
                    color: active ? col : subtext, transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {level === 'all' ? 'All' : level} <span style={{ opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ overflowY: 'auto', padding: '18px 24px', flex: 1 }}>
          {loading ? (
            /* Loading spinner */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 16 }}>
              <div style={{
                width: 40, height: 40,
                border: '3px solid rgba(248,81,73,0.25)', borderTopColor: '#f85149',
                borderRadius: '50%', animation: 'spin 0.9s linear infinite',
              }} />
              <p style={{ color: subtext, fontSize: 13 }}>Loading violation details…</p>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty */
            <div style={{ textAlign: 'center', padding: '52px 0' }}>
              <Shield size={46} color={darkMode ? '#3fb950' : '#22c55e'} style={{ margin: '0 auto 14px' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: heading, margin: '0 0 6px' }}>
                {sevFilter !== 'all' ? `No ${sevFilter} severity violations` : 'No violations for this exam!'}
              </p>
              <p style={{ fontSize: '0.85rem', color: subtext, margin: 0 }}>
                {sevFilter !== 'all' ? 'Try a different filter' : 'Students behaved properly in this exam 🎉'}
              </p>
            </div>
          ) : (
            /* Info banner + student list */
            <>
              {highTotal > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)',
                  borderRadius: 10, marginBottom: 16, fontSize: 13,
                }}>
                  <Info size={15} color="#f85149" style={{ flexShrink: 0 }} />
                  <span style={{ color: darkMode ? '#f85149' : '#b91c1c' }}>
                    <strong>{highTotal}</strong> high-severity incident{highTotal !== 1 ? 's' : ''} detected. Review carefully.
                  </span>
                </div>
              )}

              {filtered.map((student, i) => (
                <StudentAccordion
                  key={student.student_id}
                  student={student}
                  darkMode={darkMode}
                  defaultOpen={i === 0 && filtered.length <= 3}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
