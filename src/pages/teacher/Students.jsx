import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Mail, Calendar } from 'lucide-react';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function Students() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const res = await api.get('/teacher/students/');
        if (!cancelled) setStudents(res.data || []);
      } catch (e) {
        if (!cancelled) toast.error('Failed to load students');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true };
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const th = {
    padding: '12px 24px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.05em',
    color: darkMode ? '#8b949e' : '#6b7280',
    background: darkMode ? '#1c2128' : '#f9fafb',
    borderBottom: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
  };

  return (
    <TeacherLayout title="Students">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>Students</h2>
            <p style={{ color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4 }}>Manage and monitor student activities</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: darkMode ? 'rgba(56,139,253,0.1)' : '#eff6ff', borderRadius: 8 }}>
            <Users size={18} color={darkMode ? '#58a6ff' : '#2563eb'} />
            <span style={{ fontWeight: 600, color: darkMode ? '#58a6ff' : '#2563eb' }}>{students.length} Students</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: darkMode ? '#8b949e' : '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
              background: darkMode ? '#0d1117' : '#fff',
              border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
              borderRadius: 8, color: darkMode ? '#e6edf3' : '#111827',
              fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Table */}
        <div style={{ background: darkMode ? '#161b22' : '#fff', border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Student', 'Email', 'Exams Taken', 'Violations', 'Last Active'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: darkMode ? '#8b949e' : '#6b7280' }}>
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr
                    key={student._id || student.id}
                    style={{ background: darkMode ? '#161b22' : '#fff', transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#1c2128' : '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = darkMode ? '#161b22' : '#fff'}
                  >
                    <td style={{ padding: '14px 24px', borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, flexShrink: 0 }}>
                          {student.name?.[0]}
                        </div>
                        <span style={{ fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827' }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px', borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`, color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={14} />
                        {student.email}
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px', borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`, color: darkMode ? '#e6edf3' : '#111827', fontSize: '0.875rem' }}>{student.exams_taken || student.exams}</td>
                    <td style={{ padding: '14px 24px', borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}` }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                        background: (student.violations || 0) === 0 ? (darkMode ? 'rgba(46,160,67,0.15)' : '#dcfce7') : (darkMode ? 'rgba(248,129,74,0.15)' : '#ffedd5'),
                        color: (student.violations || 0) === 0 ? (darkMode ? '#3fb950' : '#15803d') : (darkMode ? '#f0883e' : '#c2410c'),
                      }}>
                        {student.violations || 0}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`, color: darkMode ? '#8b949e' : '#6b7280', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} />
                        {student.last_active || student.lastActive}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </TeacherLayout>
  );
}
