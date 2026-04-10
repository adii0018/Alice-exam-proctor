import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ExitConfirmModal = ({ 
  onConfirm, 
  onCancel, 
  answeredCount, 
  totalQuestions,
  isSubmitting = false,
}) => {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Submit Exam?
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to submit your exam? This action cannot be undone.
        </p>

        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Questions:</span>
            <span className="font-semibold text-gray-900">{totalQuestions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Answered:</span>
            <span className="font-semibold text-green-600">{answeredCount}</span>
          </div>
          {unansweredCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unanswered:</span>
              <span className="font-semibold text-red-600">{unansweredCount}</span>
            </div>
          )}
        </div>

        {/* Warning if unanswered */}
        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800 text-center">
              You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. 
              These will be marked as incorrect.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Submitting...
              </>
            ) : 'Submit Exam'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExitConfirmModal;
