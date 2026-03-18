import { motion } from 'framer-motion';
import { Users, AlertTriangle, Eye } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function LiveMonitorCard({ exam }) {
  const { darkMode } = useTheme();

  if (darkMode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(46,160,67,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(46,160,67,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {/* Live pulse */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, color: '#e6edf3', marginBottom: 4 }}>{exam.name}</h3>
          <p style={{ fontSize: 13, color: '#8b949e' }}>{exam.code}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b949e' }}>
              <Users style={{ width: 15, height: 15 }} />
              <span style={{ fontSize: 13 }}>Students</span>
            </div>
            <span style={{ fontWeight: 600, color: '#e6edf3' }}>{exam.activeStudents}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b949e' }}>
              <AlertTriangle style={{ width: 15, height: 15 }} />
              <span style={{ fontSize: 13 }}>Violations</span>
            </div>
            <span style={{ fontWeight: 600, color: '#f0883e' }}>{exam.violations}</span>
          </div>
        </div>

        <button
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 8,
            backgroundColor: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
            color: '#3fb950', fontWeight: 500, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(46,160,67,0.2)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(46,160,67,0.1)'}
        >
          <Eye style={{ width: 15, height: 15 }} />
          View Live
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all relative overflow-hidden"
    >
      <div className="absolute top-4 right-4">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-1">{exam.name}</h3>
        <p className="text-sm text-gray-500">{exam.code}</p>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4" /><span className="text-sm">Students</span></div>
          <span className="font-semibold text-gray-900">{exam.activeStudents}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600"><AlertTriangle className="w-4 h-4" /><span className="text-sm">Violations</span></div>
          <span className="font-semibold text-orange-600">{exam.violations}</span>
        </div>
      </div>
      <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        View Live
      </button>
    </motion.div>
  );
}
