import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  X, AlertTriangle, AlertOctagon, AlertCircle, Shield,
  Eye, EyeOff, MonitorOff, Volume2, Users, Maximize, Brain,
} from 'lucide-react';
import { flagAPI } from '../../utils/api';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import useViolationWebSocket from '../../hooks/useViolationWebSocket';

const V_INFO = {
  MULTIPLE_FACES:      { label: 'Multiple Faces',     icon: Users,      color: '#f85149' },
  FACE_MISSING:        { label: 'No Face Detected',   icon: EyeOff,     color: '#f0883e' },
  NO_FACE:             { label: 'No Face Detected',   icon: EyeOff,     color: '#f0883e' },
  LOOKING_AWAY:        { label: 'Looking Away',        icon: Eye,        color: '#f0883e' },
  TAB_SWITCH:          { label: 'Tab Switch',          icon: MonitorOff, color: '#d2a21a' },
  WINDOW_BLUR:         { label: 'Window Blur',         icon: MonitorOff, color: '#d2a21a' },
  FULLSCREEN_EXIT:     { label: 'Fullscreen Exit',     icon: Maximize,   color: '#d2a21a' },
  AUDIO_ANOMALY:       { label: 'Audio Anomaly',       icon: Volume2,    color: '#f0883e' },
  VOICE_DETECTED:      { label: 'Voice Detected',      icon: Volume2,    color: '#f0883e' },
  SUSPICIOUS_BEHAVIOR: { label: 'Suspicious Behavior', icon: Brain,      color: '#a371f7' },
};

const SEV_META = {
  high:   { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  border: 'rgba(248,81,73,0.3)',  icon: AlertOctagon  },
  medium: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)', border: 'rgba(240,136,62,0.3)', icon: AlertTriangle },
  low:    { color: '#d2a21a', bg: 'rgba(210,162,26,0.12)', border: 'rgba(210,162,26,0.3)', icon: AlertCircle   },
};

// Returns one row per (student × violation_type), students grouped together
function buildTableRows(students) {
  const sevOrder = { high: 3, medium: 2, low: 1 };
  const result = [];

  for (const student of students) {
    const typeCounts = {};
    const typeSev = {};
    for (const v of student.violations || []) {
      const t = v.type || v.violation_type || 'UNKNOWN';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
      const cur = typeSev[t];
      if (!cur || (sevOrder[v.severity] || 0) > (sevOrder[cur] || 0)) {
        typeSev[t] = v.severity;
      }
    }
    const typeRows = Object.entries(typeCounts).map(([type, count]) => ({
      student_id:    student.student_id,
      student_name:  student.student_name || 'Unknown',
      student_email: student.student_email || '—',
      type,
      count,
      severity: typeSev[type] || 'medium',
    }));
    // sort violation rows within student by count desc
    typeRows.sort((a, b) => b.count - a.count || (sevOrder[b.severity] || 0) - (sevOrder[a.severity] || 0));
    result.push(...typeRows);
  }
  return result;
}

export default function QuizViolationsModal({ quiz, onClose }) {
  const { darkMode } = useTheme();
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sevFilter, setSevFilter] = useState('all');
  const knownKeysRef              = useRef(new Set());

  const quizId = useMemo(() => String(quiz.id || quiz._id || ''), [quiz.id, quiz._id]);

  const buildKey = (sid, v) =>
    `${sid}|${v.type || v.violation_type || 'UNKNOWN'}|${v.timestamp || ''}`;

  useEffect(() => {
    if (!quizId) { setData([]); setLoading(false); return; }
    knownKeysRef.current = new Set();
    flagAPI.getByQuizStudents(quizId)
      .then(res => {
        const students = res.data.students || [];
        students.forEach(s =>
          (s.violations || []).forEach(v => knownKeysRef.current.add(buildKey(s.student_id, v)))
        );
        setData(students);
      })
      .catch(() => toast.error('Failed to load violation details'))
      .finally(() => setLoading(false));
  }, [quizId]);

  useViolationWebSocket({
    enabled: Boolean(quizId),
    onViolation: (violation) => {
      if (String(violation.quiz_id || '') !== quizId) return;
      const sid = String(violation.student_id || '');
      const vRec = {
        type:      violation.violation_type || violation.type || 'UNKNOWN',
        severity:  String(violation.severity || 'medium').toLowerCase(),
        face_count: violation.face_count ?? null,
        metadata:  violation.metadata || {},
        timestamp: violation.timestamp || new Date().toISOString(),
      };
      const key = buildKey(sid, vRec);
      if (knownKeysRef.current.has(key)) return;
      knownKeysRef.current.add(key);
      setData(prev => {
        const next = [...prev];
        const idx = next.findIndex(s => String(s.student_id) === sid);
        if (idx >= 0) {
          next[idx] = { ...next[idx], violations: [vRec, ...(next[idx].violations || [])] };
        } else {
          next.unshift({ student_id: sid, student_name: violation.student_name || 'Unknown', student_email: '', violations: [vRec] });
        }
        return next;
      });
    },
  });

  const rows = useMemo(() => {
    const all = buildTableRows(data);
    return sevFilter === 'all' ? all : all.filter(r => r.severity === sevFilter);
  }, [data, sevFilter]);

  const totalViolations = data.reduce((s, st) => s + st.violations.length, 0);
  const highTotal       = data.reduce((s, st) => s + st.violations.filter(v => v.severity === 'high').length, 0);

  const surface  = darkMode ? '#161b22' : '#fff';
  const border   = darkMode ? '#30363d' : '#e5e7eb';
  const heading  = darkMode ? '#e6edf3' : '#111827';
  const subtext  = darkMode ? '#8b949e' : '#6b7280';
  const panelBg  = darkMode ? '#0d1117' : '#f9fafb';
  const rowHover = darkMode ? '#1c2128' : '#f9fafb';

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ width: '100%', maxWidth: 820, maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
      >
        {/* ── Header ── */}
        <div style={{ padding: '18px 24px', background: panelBg, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={18} color="#f85149" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: heading }}>Violation Report</h2>
                <p style={{ margin: 0, fontSize: 12, color: subtext }}>{quiz.name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: `${data.length} student${data.length !== 1 ? 's' : ''}`, color: '#3b82f6' },
                { label: `${totalViolations} total violations`, color: '#f0883e' },
                highTotal > 0 && { label: `${highTotal} High severity`, color: '#f85149' },
              ].filter(Boolean).map((chip, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999, background: `${chip.color}15`, border: `1px solid ${chip.color}35`, color: chip.color }}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{ background: darkMode ? '#21262d' : '#f3f4f6', border: `1px solid ${border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: subtext, display: 'flex', alignItems: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* ── Severity filter ── */}
        {!loading && data.length > 0 && (
          <div style={{ padding: '10px 24px', background: panelBg, borderBottom: `1px solid ${border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: subtext, marginRight: 4 }}>Filter:</span>
            {['all', 'high', 'medium', 'low'].map(level => {
              const active = sevFilter === level;
              const col    = level === 'all' ? '#3b82f6' : SEV_META[level]?.color;
              const cnt    = level === 'all' ? buildTableRows(data).length : buildTableRows(data).filter(r => r.severity === level).length;
              return (
                <button key={level} onClick={() => setSevFilter(level)} style={{ padding: '5px 12px', borderRadius: 9999, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? col : border}`, background: active ? `${col}20` : (darkMode ? '#21262d' : '#f9fafb'), color: active ? col : subtext, transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {level === 'all' ? 'All' : level} <span style={{ opacity: 0.7 }}>({cnt})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 16 }}>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(248,81,73,0.25)', borderTopColor: '#f85149', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
              <p style={{ color: subtext, fontSize: 13 }}>Loading violations…</p>
            </div>
          ) : rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '52px 0' }}>
              <Shield size={46} color={darkMode ? '#3fb950' : '#22c55e'} style={{ margin: '0 auto 14px' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem', color: heading, margin: '0 0 6px' }}>
                {sevFilter !== 'all' ? `No ${sevFilter} severity violations` : 'No violations for this exam!'}
              </p>
              <p style={{ fontSize: '0.85rem', color: subtext, margin: 0 }}>
                {sevFilter !== 'all' ? 'Try a different filter' : 'Students behaved properly 🎉'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: panelBg, position: 'sticky', top: 0, zIndex: 1 }}>
                  {['#', 'Student Name', 'Email', 'Violation Type', 'Severity', 'Count'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: subtext, borderBottom: `1px solid ${border}`, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let studentCounter = 0;
                  let lastStudentId  = null;
                  return rows.map((row, i) => {
                    const isFirst = row.student_id !== lastStudentId;
                    if (isFirst) { studentCounter++; lastStudentId = row.student_id; }

                    const vInfo = V_INFO[row.type] || { label: row.type, icon: AlertTriangle, color: '#8b949e' };
                    const sev   = SEV_META[row.severity] || SEV_META.medium;
                    const VIcon = vInfo.icon;
                    const SIcon = sev.icon;
                    const topBorder = isFirst && i !== 0
                      ? `2px solid ${darkMode ? '#30363d' : '#d1d5db'}`
                      : `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`;

                    return (
                      <motion.tr
                        key={`${row.student_id}-${row.type}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{ borderTop: topBorder, transition: 'background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = rowHover; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', color: subtext, fontSize: 12, verticalAlign: 'top' }}>
                          {isFirst ? studentCounter : ''}
                        </td>
                        <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                          {isFirst && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${sev.color}cc, ${sev.color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                                {row.student_name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: 13, color: heading }}>{row.student_name}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', color: subtext, fontSize: 12, verticalAlign: 'top' }}>
                          {isFirst ? row.student_email : ''}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', borderRadius: 8, background: `${vInfo.color}12`, border: `1px solid ${vInfo.color}30` }}>
                            <VIcon size={13} color={vInfo.color} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: vInfo.color }}>{vInfo.label}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, background: sev.bg, border: `1px solid ${sev.border}`, fontSize: 11, fontWeight: 700, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <SIcon size={9} /> {row.severity}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: row.count >= 3 ? 'rgba(248,81,73,0.15)' : 'rgba(240,136,62,0.12)', border: `1px solid ${row.count >= 3 ? 'rgba(248,81,73,0.4)' : 'rgba(240,136,62,0.3)'}`, fontWeight: 800, fontSize: 13, color: row.count >= 3 ? '#f85149' : '#f0883e' }}>
                            {row.count}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
