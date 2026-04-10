import { motion, AnimatePresence } from 'framer-motion';
import { Mic, AlertTriangle } from 'lucide-react';

/**
 * Calm warning banner for audio / voice detection
 * Styled identical to MultiFaceWarning — amber card sliding in from top
 */
const AudioWarning = ({ isVisible, severity = 'medium', message }) => {
  // Choose icon and colours based on severity
  const isHigh = severity === 'high';

  const defaultMessage = isHigh
    ? 'Loud voice detected! Your exam is flagged for review.'
    : 'Voice detected in background. Please stay silent during the exam.';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="audio-warning"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`border-2 rounded-xl shadow-lg px-6 py-4 max-w-md ${
              isHigh
                ? 'bg-red-50 border-red-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isHigh ? 'bg-red-100' : 'bg-amber-100'
                  }`}
                >
                  <Mic
                    className={`w-5 h-5 ${
                      isHigh ? 'text-red-600' : 'text-amber-600'
                    }`}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold mb-1 ${
                    isHigh ? 'text-red-900' : 'text-amber-900'
                  }`}
                >
                  {isHigh ? 'Voice Detected — High Alert' : 'Voice Detected'}
                </h3>
                <p
                  className={`text-sm ${
                    isHigh ? 'text-red-700' : 'text-amber-700'
                  }`}
                >
                  {message || defaultMessage}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioWarning;
