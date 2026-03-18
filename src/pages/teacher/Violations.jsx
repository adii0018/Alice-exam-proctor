import { motion } from 'framer-motion';
import FlagMonitor from '../../components/teacher/FlagMonitor';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useTheme } from '../../contexts/ThemeContext';

export default function Violations() {
  const { darkMode } = useTheme();
  return (
    <TeacherLayout title="Violations">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>Violations</h2>
          <p style={{ color: darkMode ? '#8b949e' : '#6b7280', marginTop: 4 }}>Monitor and manage proctoring violations</p>
        </div>
        <FlagMonitor />
      </motion.div>
    </TeacherLayout>
  );
}
