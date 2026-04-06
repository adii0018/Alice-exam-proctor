import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, ShieldAlert, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { violationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ExamDetailsModal({ exam, onClose }) {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchExamSubmissions();
  }, [exam]);

  const fetchExamSubmissions = async () => {
    try {
      setLoading(true);
      // Fetch violations grouped by student
      const response = await violationAPI.getByQuizStudents(exam.id || exam._id);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Failed to fetch exam details:', error);
      toast.error('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: darkMode ? { bg: 'rgba(154,103,0,0.15)', text: '#d2a21a', border: '#9a6700' } : { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
      medium: darkMode ? { bg: 'rgba(240,136,62,0.15)', text: '#f0883e', border: '#bc4c00' } : { bg: '#fed7aa', text: '#c2410c', border: '#fb923c' },
      high: darkMode ? { bg: 'rgba(248,81,73,0.15)', text: '#f85149', border: '#da3633' } : { bg: '#fecaca', text: '#991b1b', border: '#ef4444' },
      critical: darkMode ? { bg: 'rgba(248,81,73,0.2)', text: '#ff6b6b', border: '#da3633' } : { bg: '#fca5a5', text: '#7f1d1d', border: '#dc2626' },
    };
    return colors[severity] || colors.medium;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: darkMode ? '#0d1117' : '#fff',
          border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
          borderRadius: 16,
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: `1px solid ${darkMode ? '#21262d' : '#f3f4f6'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: darkMode ? '#e6edf3' : '#111827',
                marginBottom: 4,
              }}
            >
              {exam.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: darkMode ? '#8b949e' : '#6b7280' }}>
              Exam Code: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{exam.code}</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: darkMode ? '#21262d' : '#f3f4f6',
              border: 'none',
              borderRadius: 8,
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: darkMode ? '#8b949e' : '#6b7280',
            }}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: darkMode ? '#8b949e' : '#6b7280' }}>
              <div style={{ fontSize: '0.95rem' }}>Loading exam details...</div>
            </div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: darkMode ? '#8b949e' : '#6b7280' }}>
              <ShieldAlert size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <div style={{ fontSize: '0.95rem', marginBottom: 8 }}>No submissions yet</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Students haven't taken this exam</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {students.map((student, index) => {
                const totalViolations = student.violations?.length || 0;
                const highSeverity = student.violations?.filter(v => v.severity === 'high' || v.severity === 'critical').length || 0;

                return (
                  <motion.div
                    key={student.student_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      background: darkMode ? '#161b22' : '#f9fafb',
                      border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                      borderRadius: 12,
                      padding: '20px 24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      {/* Student Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                          }}
                        >
                          {student.student_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: darkMode ? '#e6edf3' : '#111827',
                              marginBottom: 4,
                            }}
                          >
                            {student.student_name || 'Unknown Student'}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem' }}>
                            <span style={{ color: darkMode ? '#8b949e' : '#6b7280' }}>
                              ID: {student.student_id?.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Violations */}
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: totalViolations > 0 ? '#f85149' : (darkMode ? '#3fb950' : '#15803d'),
                              marginBottom: 2,
                            }}
                          >
                            {totalViolations}
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              color: darkMode ? '#8b949e' : '#6b7280',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Violations
                          </div>
                        </div>

                        {highSeverity > 0 && (
                          <div
                            style={{
                              background: 'rgba(248,81,73,0.15)',
                              border: '1px solid #f85149',
                              borderRadius: 8,
                              padding: '6px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <AlertTriangle size={14} color="#f85149" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f85149' }}>
                              {highSeverity} High
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: darkMode ? '#0d1117' : '#fff',
                border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                borderRadius: 16,
                maxWidth: 700,
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: 28,
                boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {selectedStudent.student_name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827', marginBottom: 4 }}>
                      {selectedStudent.student_name || 'Unknown Student'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: darkMode ? '#8b949e' : '#6b7280' }}>
                      Student ID: {selectedStudent.student_id}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    background: darkMode ? '#21262d' : '#f3f4f6',
                    border: 'none',
                    borderRadius: 8,
                    padding: 8,
                    cursor: 'pointer',
                    color: darkMode ? '#8b949e' : '#6b7280',
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Violations List */}
              <div>
                <h4
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: darkMode ? '#8b949e' : '#6b7280',
                    letterSpacing: '0.05em',
                    marginBottom: 16,
                  }}
                >
                  Violations ({selectedStudent.violations?.length || 0})
                </h4>
                {selectedStudent.violations && selectedStudent.violations.length > 0 ? (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {selectedStudent.violations.map((violation, idx) => {
                      const severityColor = getSeverityColor(violation.severity);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          style={{
                            background: darkMode ? '#161b22' : '#f9fafb',
                            border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
                            borderRadius: 10,
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827', marginBottom: 4 }}>
                              {violation.type}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: darkMode ? '#8b949e' : '#6b7280' }}>
                              {new Date(violation.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <span
                            style={{
                              ...severityColor,
                              background: severityColor.bg,
                              color: severityColor.text,
                              border: `1px solid ${severityColor.border}`,
                              padding: '4px 10px',
                              borderRadius: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            {violation.severity}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: darkMode ? '#8b949e' : '#6b7280' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '0.9rem' }}>No violations detected</div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
