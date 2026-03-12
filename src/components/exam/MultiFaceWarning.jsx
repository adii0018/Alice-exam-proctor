import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle } from 'lucide-react';

/**
 * Calm warning modal for multiple face detection
 * Shows a non-intrusive message to the student
 */
const MultiFaceWarning = ({ faceCount, isVisible }) => {
  if (!isVisible || faceCount <= 1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl shadow-lg px-6 py-4 max-w-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Multiple Faces Detected
              </h3>
              <p className="text-sm text-amber-700">
                We detected {faceCount} faces in your camera. Please ensure you are alone during the exam.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MultiFaceWarning;
