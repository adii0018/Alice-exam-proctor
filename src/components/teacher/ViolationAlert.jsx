import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import soundManager from '../../utils/soundEffects';

/**
 * Real-time violation alert toast for teachers
 * Shows when a student triggers a violation
 */
const ViolationAlert = ({ violation, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play alert sound when violation appears
    if (violation.severity === 'high') {
      soundManager.playViolationAlert();
    } else {
      soundManager.playWarning();
    }

    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  const getViolationIcon = () => {
    switch (violation.violation_type) {
      case 'MULTIPLE_FACES':
        return Users;
      case 'LOOKING_AWAY':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getViolationColor = () => {
    switch (violation.severity) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-900',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-700'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          text: 'text-amber-900',
          icon: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-900',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-700'
        };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getViolationMessage = () => {
    switch (violation.violation_type) {
      case 'MULTIPLE_FACES':
        return `${violation.face_count} faces detected in camera`;
      case 'LOOKING_AWAY':
        const direction = violation.metadata?.direction || 'away';
        const duration = violation.metadata?.duration || 0;
        return `Student looked ${direction} from screen for ${duration} seconds`;
      case 'NO_FACE':
        return 'No face detected in camera';
      case 'TAB_SWITCH':
        return 'Student switched tabs or minimized window';
      case 'FULLSCREEN_EXIT':
        return 'Student exited fullscreen mode';
      default:
        return violation.message || 'Violation detected';
    }
  };

  const Icon = getViolationIcon();
  const colors = getViolationColor();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="w-96"
      >
        <div className={`${colors.bg} border-2 ${colors.border} rounded-xl shadow-xl p-4`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 ${colors.badge} rounded-full flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${colors.text}`}>
                  Violation Alert
                </h3>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(violation.timestamp)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Student:</span>
              <span className={`text-sm font-bold ${colors.text}`}>
                {violation.student_name}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Type:</span>
              <span className={`text-xs px-2 py-1 ${colors.badge} rounded-full font-medium`}>
                {violation.violation_type.replace('_', ' ')}
              </span>
            </div>

            <div className={`mt-3 p-3 bg-white rounded-lg border ${colors.border}`}>
              <p className="text-sm text-gray-700">
                {getViolationMessage()}
              </p>
            </div>
          </div>

          {/* Severity Badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-xs px-3 py-1 ${colors.badge} rounded-full font-semibold uppercase`}>
              {violation.severity} Severity
            </span>
            <span className="text-xs text-gray-500">
              ID: {violation.student_id.slice(-6)}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Container for multiple violation alerts
 */
export const ViolationAlertContainer = ({ violations, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-y-auto">
      {violations.map((violation, index) => (
        <ViolationAlert
          key={violation.id || index}
          violation={violation}
          onDismiss={() => onDismiss(violation.id || index)}
        />
      ))}
    </div>
  );
};

export default ViolationAlert;
