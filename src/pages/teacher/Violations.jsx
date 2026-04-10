import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Shield, ChevronRight, Search,
  AlertCircle, AlertOctagon, BookOpen, Radio,
} from 'lucide-react';
import { quizAPI, flagAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import QuizViolationsModal from '../../components/teacher/QuizViolationsModal';
import { useTheme } from '../../contexts/ThemeContext';

/* ── Severity colours ── */
const SEV = {
  high:   { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  border: 'rgba(248,81,73,0.3)',  icon: AlertOctagon  },
  medium: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)', border: 'rgba(240,136,62,0.3)', icon: AlertTriangle },
  low:    { color: '#d2a21a', bg: 'rgba(210,162,26,0.12)', border: 'rgba(210,162,26,0.3)', icon: AlertCircle   },
};

/* ── Stat pill ── */
function SevPill({ count, level }) {
  if (!count) return null;
  const s = SEV[level];
  const Icon = s.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600, color: s.color,
    }}>
      <Icon size={10} /> {count}
    </span>
  );
}

/* ── Single quiz card ── */
function QuizCard({ quiz, flags, darkMode, onClick }) {
  const high   = flags.filter(f => f.severity?.toLowerCase() === 'high').length;
  const medium = flags.filter(f => f.severity?.toLowerCase() === 'medium').length;
  const low    = flags.filter(f => f.severity?.toLowerCase() === 'low').length;
  const total  = flags.length;

  const surface = darkMode ? '#161b22' : '#fff';
  const border  = darkMode ? '#30363d' : '#e5e7eb';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const subtext = darkMode ? '#8b949e' : '#6b7280';

  /* Risk level */
  const risk = high >= 3 ? 'Critical' : high >= 1 ? 'High' : medium >= 3 ? 'Medium' : 'Low';
  const riskColor = { Critical: '#f85149', High: '#f0883e', Medium: '#d2a21a', Low: '#3fb950' }[risk];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: surface,
        border: `1px solid ${total > 0 ? (high > 0 ? 'rgba(248,81,73,0.4)' : border) : border}`,
        borderRadius: 14, padding: '20px 22px',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top-right: risk badge */}
      <div style={{ position: 'absolute', top: 14, right: 14 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px',
          borderRadius: 9999, background: `${riskColor}20`,
          border: `1px solid ${riskColor}50`, color: riskColor,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {risk} Risk
        </span>
      </div>

      {/* Left accent bar */}
      {total > 0 && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: high > 0 ? '#f85149' : medium > 0 ? '#f0883e' : '#d2a21a',
          borderRadius: '14px 0 0 14px',
        }} />
      )}

      {/* Quiz icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, flexShrink: 0,
          background: darkMode ? '#21262d' : '#f0f4ff',
          border: `1px solid ${darkMode ? '#30363d' : '#c7d2fe'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BookOpen size={18} color={darkMode ? '#3b82f6' : '#4f46e5'} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: heading, marginBottom: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 60 }}>
            {quiz.title}
          </div>
          <div style={{ fontSize: 12, color: subtext }}>
            Code: <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{quiz.code}</span>
            &nbsp;·&nbsp;
            <span style={{ color: quiz.is_active ? '#3fb950' : subtext }}>
              {quiz.is_active ? '🟢 Live' : '⚫ Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: subtext }}>
          <AlertTriangle size={13} color={total > 0 ? '#f0883e' : subtext} />
          <span style={{ fontWeight: total > 0 ? 700 : 400, color: total > 0 ? heading : subtext }}>
            {total} violation{total !== 1 ? 's' : ''}
          </span>
        </div>
        {total > 0 && (
          <div style={{ display: 'flex', gap: 5 }}>
            <SevPill count={high}   level="high"   />
            <SevPill count={medium} level="medium" />
            <SevPill count={low}    level="low"    />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, borderRadius: 9999, background: darkMode ? '#21262d' : '#f3f4f6', overflow: 'hidden' }}>
        {high > 0 && (
          <div style={{
            height: '100%', borderRadius: 9999, width: `${Math.min(100, (high / Math.max(total, 1)) * 100)}%`,
            background: 'linear-gradient(90deg, #f85149, #f0883e)', transition: 'width 0.6s ease',
          }} />
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <span style={{ fontSize: 11, color: subtext }}>
          {quiz.duration} min &nbsp;·&nbsp; {quiz.questions?.length || 0} questions
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}>
          View Report <ChevronRight size={14} />
        </span>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function Violations() {
  const { darkMode } = useTheme();
  const [quizzes, setQuizzes]           = useState([]);
  const [flags, setFlags]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [search, setSearch]             = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [newFlagIds, setNewFlagIds]     = useState(new Set()); // IDs of newly arrived flags
  const [lastSeen, setLastSeen]         = useState(0);         // timestamp of last check
  const [isLive, setIsLive]             = useState(false);     // pulse indicator
  const knownIdsRef                     = useRef(new Set());   // persisted across renders
  const POLL_MS = 10_000;                                      // poll every 10 s

  /* ── helpers ── */
  const sevLabel = sev => sev?.toLowerCase();
  const violationEmoji = sev => ({ high: '🚨', medium: '⚠️', low: '🔔' })[sevLabel(sev)] || '⚠️';

  const notifyNew = useCallback((newFlags) => {
    if (!newFlags.length) return;
    setIsLive(true);
    setTimeout(() => setIsLive(false), 3000);

    // Highlight new quiz cards for 4 s
    const ids = new Set(newFlags.map(f => f._id));
    setNewFlagIds(ids);
    setTimeout(() => setNewFlagIds(new Set()), 4000);

    // Fire individual toasts (max 3, then summary)
    const toShow = newFlags.slice(0, 3);
    toShow.forEach(f => {
      toast(
        `${violationEmoji(f.severity)} ${f.student_name || 'Student'} — ${f.type || 'Violation'}`,
        {
          duration: 5000,
          style: {
            background: f.severity?.toLowerCase() === 'high' ? '#f85149'
              : f.severity?.toLowerCase() === 'medium' ? '#f0883e' : '#d2a21a',
            color: '#fff', fontWeight: 600, fontSize: 13,
          },
          icon: violationEmoji(f.severity),
        }
      );
    });
    if (newFlags.length > 3) {
      toast(`+ ${newFlags.length - 3} more new violation${newFlags.length - 3 > 1 ? 's' : ''}`, {
        duration: 5000, icon: '📋',
      });
    }
  }, []);

  /* ── initial load ── */
  const initialLoad = useCallback(async () => {
    try {
      setLoading(true);
      const [qRes, fRes] = await Promise.all([quizAPI.getAll(), flagAPI.getAll()]);
      setQuizzes(qRes.data);
      setFlags(fRes.data);
      // seed known IDs so we don't notify on first load
      knownIdsRef.current = new Set(fRes.data.map(f => f._id));
      setLastSeen(Date.now());
    } catch {
      toast.error('Failed to load violations');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── polling fetch (flags only, lightweight) ── */
  const pollFlags = useCallback(async () => {
    try {
      const fRes = await flagAPI.getAll();
      const allFlags = fRes.data;

      // Detect new flags
      const brand_new = allFlags.filter(f => !knownIdsRef.current.has(f._id));
      if (brand_new.length > 0) {
        brand_new.forEach(f => knownIdsRef.current.add(f._id));
        setFlags(allFlags);   // update state
        notifyNew(brand_new);
      }
      setLastSeen(Date.now());
    } catch {
      // silent fail on poll errors
    }
  }, [notifyNew]);

  /* ── mount: initial load + start polling ── */
  useEffect(() => {
    initialLoad();
    const timer = setInterval(pollFlags, POLL_MS);
    return () => clearInterval(timer); // cleanup on unmount
  }, [initialLoad, pollFlags]);


  /* Flags grouped by quiz id */
  const flagsByQuiz = quizzes.reduce((acc, q) => {
    const qid = q._id || q.id;
    acc[qid] = flags.filter(f => f.quiz_id === qid || f.quiz_id === String(qid));
    return acc;
  }, {});

  /* Summary stats */
  const totalFlags  = flags.length;
  const highCount   = flags.filter(f => f.severity?.toLowerCase() === 'high').length;
  const medCount    = flags.filter(f => f.severity?.toLowerCase() === 'medium').length;
  const lowCount    = flags.filter(f => f.severity?.toLowerCase() === 'low').length;
  const quizzesWithFlags = quizzes.filter(q => (flagsByQuiz[q._id || q.id] || []).length > 0).length;

  /* Filter quizzes */
  const filtered = quizzes
    .filter(q => {
      const qFlags = flagsByQuiz[q._id || q.id] || [];
      if (severityFilter !== 'all' && !qFlags.some(f => f.severity?.toLowerCase() === severityFilter)) return false;
      const s = search.toLowerCase();
      return !s || q.title?.toLowerCase().includes(s) || q.code?.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const af = (flagsByQuiz[a._id || a.id] || []).length;
      const bf = (flagsByQuiz[b._id || b.id] || []).length;
      return bf - af; // most violations first
    });

  const surface = darkMode ? '#161b22' : '#fff';
  const border  = darkMode ? '#30363d' : '#e5e7eb';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const subtext = darkMode ? '#8b949e' : '#6b7280';
  const input   = darkMode ? '#0d1117'  : '#f9fafb';

  return (
    <TeacherLayout title="Violation Monitor">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: heading, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 10, padding: '6px 10px', display: 'flex' }}>
                <AlertTriangle size={20} color="#f85149" />
              </span>
              Violation Monitor
            </h1>
            <p style={{ color: subtext, marginTop: 6, fontSize: '0.875rem' }}>
              Select a quiz to see detailed student cheating reports
            </p>
          </div>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[
            { label: 'Total Violations', value: totalFlags, color: '#f85149', bg: 'rgba(248,81,73,0.08)', border: 'rgba(248,81,73,0.2)', icon: AlertTriangle },
            { label: 'High Severity',    value: highCount,  color: '#f85149', bg: 'rgba(248,81,73,0.08)', border: 'rgba(248,81,73,0.2)', icon: AlertOctagon  },
            { label: 'Medium Severity',  value: medCount,   color: '#f0883e', bg: 'rgba(240,136,62,0.08)',border: 'rgba(240,136,62,0.2)',icon: AlertTriangle },
            { label: 'Quizzes Affected', value: quizzesWithFlags, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: BookOpen },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ background: darkMode ? s.bg : '#fff', border: `1px solid ${darkMode ? s.border : '#e5e7eb'}`, borderRadius: 12, padding: '16px 18px',
                  boxShadow: darkMode ? 'none' : '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color={s.color} />
                  <span style={{ fontSize: 12, color: subtext }}>{s.label}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: darkMode ? s.color : heading, marginTop: 8 }}>
                  {s.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} color={subtext} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search quiz name or code…"
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                background: input, border: `1px solid ${border}`, borderRadius: 10,
                fontSize: 13, color: heading, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Severity filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'high', 'medium', 'low'].map(level => {
              const active = severityFilter === level;
              const col = level === 'all' ? '#3b82f6' : SEV[level]?.color;
              return (
                <button
                  key={level}
                  onClick={() => setSeverityFilter(level)}
                  style={{
                    padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', border: `1px solid ${active ? col : border}`,
                    background: active ? `${col}20` : (darkMode ? '#21262d' : '#f9fafb'),
                    color: active ? col : subtext, transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {level === 'all' ? 'All Quizzes' : level}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Quiz Grid ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(248,81,73,0.3)', borderTopColor: '#f85149', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: '60px 24px', textAlign: 'center' }}>
            <Shield size={44} color={darkMode ? '#3fb950' : '#22c55e'} style={{ margin: '0 auto 14px' }} />
            <p style={{ fontWeight: 700, fontSize: '1rem', color: heading, margin: '0 0 6px' }}>
              {search || severityFilter !== 'all' ? 'No quizzes match your filter' : 'No violations recorded yet!'}
            </p>
            <p style={{ fontSize: '0.85rem', color: subtext, margin: 0 }}>
              {search || severityFilter !== 'all' ? 'Try changing your search or filter' : 'Everything looks clean 🎉'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((quiz, i) => {
              const qid = quiz._id || quiz.id;
              return (
                <motion.div key={qid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <QuizCard
                    quiz={quiz}
                    flags={flagsByQuiz[qid] || []}
                    darkMode={darkMode}
                    onClick={() => setSelectedQuiz({ id: qid, name: quiz.title })}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Violations Detail Modal ── */}
      <AnimatePresence>
        {selectedQuiz && (
          <QuizViolationsModal
            quiz={selectedQuiz}
            onClose={() => setSelectedQuiz(null)}
          />
        )}
      </AnimatePresence>
    </TeacherLayout>
  );
}
