import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const WarningModal = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-yellow-900 mb-1">
              Warning
            </h3>
            <p className="text-sm text-yellow-800">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-yellow-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-yellow-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WarningModal;
