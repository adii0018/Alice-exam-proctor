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

  if (darkMode) {
    return (
      <div style={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #21262d' }}>
                {['Student', 'Exam', 'Violation Type', 'Severity', 'Time'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                    style={{ borderBottom: '1px solid #21262d', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1c2128'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          backgroundColor: '#21262d', border: '1px solid #30363d',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 600, color: '#3fb950',
                        }}>
                          {v.student[0]}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#e6edf3' }}>{v.student}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#8b949e' }}>{v.exam}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#8b949e' }}>{v.type}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 10px', borderRadius: 9999,
                        backgroundColor: sc.dark.bg, border: `1px solid ${sc.dark.border}`,
                      }}>
                        <SeverityIcon style={{ width: 12, height: 12, color: sc.dark.color }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: sc.dark.color }}>{v.severity}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#6e7681' }}>{v.time}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Student', 'Exam', 'Violation Type', 'Severity', 'Time'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {violations.map((v, index) => {
              const sc = severityConfig[v.severity] || severityConfig.Low;
              const SeverityIcon = sc.icon;
              return (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{v.student[0]}</span>
                      </div>
                      <span className="font-medium text-gray-900">{v.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{v.exam}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{v.type}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.light}`}>
                      <SeverityIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{v.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.time}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
