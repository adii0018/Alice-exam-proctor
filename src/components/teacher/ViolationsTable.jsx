import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const severityConfig = {
  Low:    { light: 'text-yellow-600 bg-yellow-50', icon: AlertCircle,   dark: { color: '#d2a21a', bg: 'rgba(210,162,26,0.1)', border: 'rgba(210,162,26,0.3)' } },
  Medium: { light: 'text-orange-600 bg-orange-50', icon: AlertTriangle, dark: { color: '#f0883e', bg: 'rgba(240,136,62,0.1)', border: 'rgba(240,136,62,0.3)' } },
  High:   { light: 'text-red-600 bg-red-50',       icon: AlertOctagon,  dark: { color: '#f85149', bg: 'rgba(248,81,73,0.1)',  border: 'rgba(248,81,73,0.3)'  } },
};

export default function ViolationsTable({ violations }) {
  const { darkMode } = useTheme();

  const surface = darkMode ? '#161b22' : '#fff';
  const border  = darkMode ? '#30363d' : '#e5e7eb';
  const subtext = darkMode ? '#8b949e' : '#6b7280';
  const heading = darkMode ? '#e6edf3' : '#111827';
  const rowHover= darkMode ? '#1c2128' : '#f9fafb';

  return (
    <>
      {/* ── Mobile: card list (hidden on md+) ── */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {violations.map((v, index) => {
          const sc = severityConfig[v.severity] || severityConfig.Low;
          const SeverityIcon = sc.icon;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 12, padding: '14px 16px',
              }}
            >
              {/* Top row: avatar + name + time */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: darkMode ? '#21262d' : 'linear-gradient(135deg,#059669,#0d9488)',
                    border: darkMode ? '1px solid #30363d' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: darkMode ? '#3fb950' : '#fff',
                  }}>
                    {v.student[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: heading }}>{v.student}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: subtext }}>{v.exam}</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: subtext }}>{v.time}</span>
              </div>

              {/* Bottom row: type + severity */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <span style={{
                  fontSize: '0.75rem', color: subtext,
                  background: darkMode ? '#21262d' : '#f3f4f6',
                  border: `1px solid ${border}`,
                  padding: '3px 10px', borderRadius: 8,
                }}>
                  {v.type}
                </span>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 9999,
                  background: darkMode ? sc.dark.bg : undefined,
                  border: darkMode ? `1px solid ${sc.dark.border}` : undefined,
                }}
                  className={darkMode ? '' : `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.light}`}
                >
                  <SeverityIcon style={{ width: 12, height: 12, color: darkMode ? sc.dark.color : undefined }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: darkMode ? sc.dark.color : undefined }}>{v.severity}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Desktop: table (hidden on mobile) ── */}
      <div
        className="hidden md:block"
        style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: darkMode ? '#0d1117' : '#f9fafb', borderBottom: `1px solid ${border}` }}>
                {['Student', 'Exam', 'Violation Type', 'Severity', 'Time'].map(h => (
                  <th key={h} style={{
                    padding: '10px 20px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: subtext,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {violations.map((v, index) => {
                const sc = severityConfig[v.severity] || severityConfig.Low;
                const SeverityIcon = sc.icon;
                return (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = rowHover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                          background: darkMode ? '#21262d' : 'linear-gradient(135deg,#059669,#0d9488)',
                          border: darkMode ? '1px solid #30363d' : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: darkMode ? '#3fb950' : '#fff',
                        }}>
                          {v.student[0]}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: heading }}>{v.student}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: subtext }}>{v.exam}</td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: subtext }}>{v.type}</td>
                    <td style={{ padding: '13px 20px' }}>
                      {darkMode ? (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 10px', borderRadius: 9999,
                          background: sc.dark.bg, border: `1px solid ${sc.dark.border}`,
                        }}>
                          <SeverityIcon style={{ width: 12, height: 12, color: sc.dark.color }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: sc.dark.color }}>{v.severity}</span>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.light}`}>
                          <SeverityIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{v.severity}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: 13, color: subtext }}>{v.time}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
