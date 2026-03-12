import { motion } from 'framer-motion';

const ViolationChart = () => {
  const data = [
    { name: 'Mon', low: 12, medium: 8, high: 3, critical: 1 },
    { name: 'Tue', low: 15, medium: 10, high: 5, critical: 2 },
    { name: 'Wed', low: 10, medium: 6, high: 2, critical: 0 },
    { name: 'Thu', low: 18, medium: 12, high: 7, critical: 3 },
    { name: 'Fri', low: 14, medium: 9, high: 4, critical: 1 },
    { name: 'Sat', low: 8, medium: 4, high: 1, critical: 0 },
    { name: 'Sun', low: 6, medium: 3, high: 1, critical: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Violations Trend (Last 7 Days)
      </h3>
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Chart will render here (Recharts dependency issue - using placeholder)</p>
      </div>
    </motion.div>
  );
};

export default ViolationChart;
