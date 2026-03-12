import { motion } from 'framer-motion';
import FlagMonitor from '../../components/teacher/FlagMonitor';
import TeacherLayout from '../../components/teacher/TeacherLayout';

export default function Violations() {
  return (
    <TeacherLayout title="Violations">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Violations</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage proctoring violations</p>
        </div>
        
        <FlagMonitor />
      </motion.div>
    </TeacherLayout>
  );
}
