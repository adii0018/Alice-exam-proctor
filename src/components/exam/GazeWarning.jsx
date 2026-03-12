/**
 * Gaze Warning Component
 * Shows calm warning when student looks away from screen
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, AlertCircle } from 'lucide-react';

const GazeWarning = ({ isVisible, direction, duration }) => {
  const getDirectionText = () => {
    switch (direction) {
      case 'left': return 'to the left';
      case 'right': return 'to the right';
      case 'up': return 'upward';
      case 'down': return 'downward';
      case 'no_face': return 'away';
      default: return 'away';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl shadow-lg px-6 py-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Please focus on the screen
                </h3>
                <p className="text-xs text-blue-700">
                  You're looking {getDirectionText()}. Keep your attention on the exam.
                </p>
                {duration > 0 && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Duration: {duration}s
                  </p>
                )}
              </div>
              
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GazeWarning;
