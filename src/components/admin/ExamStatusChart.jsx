import { motion } from 'framer-motion';

const ExamStatusChart = () => {
  const data = [
    { name: 'Live', value: 12, color: '#10B981' },
    { name: 'Completed', value: 45, color: '#3B82F6' },
    { name: 'Scheduled', value: 23, color: '#8B5CF6' },
    { name: 'Flagged', value: 5, color: '#EF4444' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Exam Status Distribution
      </h3>
      <div className="h-64 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.value} exams
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExamStatusChart;
