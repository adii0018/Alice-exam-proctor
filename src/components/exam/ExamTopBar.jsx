import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

const ExamTopBar = ({ 
  examName, 
  timeRemaining, 
  violationCount, 
  onSubmit,
  onShowRules 
}) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isHighViolations = violationCount >= 7;

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Exam Name */}
        <div className="flex items-center gap-3">
          <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate max-w-[200px] lg:max-w-none">
            {examName}
          </h1>
          <button
            onClick={onShowRules}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="View exam rules"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Center - Timer */}
        <motion.div
          animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: isLowTime ? Infinity : 0 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg lg:text-2xl font-bold ${
            isLowTime 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-gray-50 text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(timeRemaining)}
        </motion.div>

        {/* Right - Violations & Submit */}
        <div className="flex items-center gap-3">
          {/* Violation Counter */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            isHighViolations
              ? 'bg-red-50 text-red-700 border border-red-200'
              : violationCount > 0
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-gray-50 text-gray-600'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Warnings:</span>
            <span className="font-bold">{violationCount}/10</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTopBar;
