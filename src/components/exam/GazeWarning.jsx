/**
 * GazeWarning Component
 * Shows warning when student looks away OR when a repetitive eye pattern is detected.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, AlertCircle, AlertTriangle } from 'lucide-react';
import { PatternType } from '../../utils/proctoring/GazePatternAnalyzer';

// ── Pattern-specific messages ─────────────────────────────────────────────────
const PATTERN_MESSAGES = {
  [PatternType.REPEAT_GLANCE]: {
    title: 'Suspicious eye movement detected',
    body:  (dir, count) => `You've looked ${dir} ${count}× in a short time. This may indicate use of external materials.`,
    color: 'orange',
  },
  [PatternType.ALTERNATING]: {
    title: 'Repetitive gaze pattern detected',
    body:  (dir, count) => `Your eyes keep returning to the ${dir} (${count}× alternating). Please focus on the screen.`,
    color: 'orange',
  },
  [PatternType.RAPID_SCAN]: {
    title: 'Rapid eye scanning detected',
    body:  (_dir, count) => `${count} rapid gaze shifts detected. Avoid scanning around during the exam.`,
    color: 'red',
  },
  [PatternType.DOWN_REPEAT]: {
    title: 'Repeated downward glances',
    body:  (_dir, count) => `You've looked down ${count}× — possible phone or notes below. Keep eyes on screen.`,
    color: 'orange',
  },
};

const COLOR_CLASSES = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   icon: 'bg-blue-100',   iconColor: 'text-blue-600',   title: 'text-blue-900',   body: 'text-blue-700',   alert: 'text-blue-500'   },
  orange: { bg: 'bg-orange-50', border: 'border-orange-300', icon: 'bg-orange-100', iconColor: 'text-orange-600', title: 'text-orange-900', body: 'text-orange-700', alert: 'text-orange-500' },
  red:    { bg: 'bg-red-50',    border: 'border-red-300',    icon: 'bg-red-100',    iconColor: 'text-red-600',    title: 'text-red-900',    body: 'text-red-700',    alert: 'text-red-500'    },
};

const GazeWarning = ({ isVisible, direction, duration, gazePattern }) => {
  // Pattern warning takes priority over simple gaze-away warning
  const patternCfg = gazePattern ? PATTERN_MESSAGES[gazePattern.patternType] : null;

  const colorKey = patternCfg
    ? patternCfg.color
    : 'blue';
  const c = COLOR_CLASSES[colorKey];

  const title = patternCfg
    ? patternCfg.title
    : 'Please focus on the screen';

  const bodyText = patternCfg
    ? patternCfg.body(gazePattern.direction, gazePattern.count)
    : `You're looking ${direction === 'left' ? 'to the left' : direction === 'right' ? 'to the right' : direction === 'up' ? 'upward' : direction === 'down' ? 'downward' : 'away'}. Keep your attention on the exam.`;

  const showWarning = isVisible || !!gazePattern;

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          key={gazePattern?.patternType ?? 'gaze'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${c.bg} border-2 ${c.border} rounded-xl shadow-lg px-6 py-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 ${c.icon} rounded-full flex items-center justify-center`}>
                  {patternCfg
                    ? <AlertTriangle className={`w-5 h-5 ${c.iconColor}`} />
                    : <Eye className={`w-5 h-5 ${c.iconColor}`} />
                  }
                </div>
              </div>

              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${c.title} mb-1`}>
                  {title}
                </h3>
                <p className={`text-xs ${c.body}`}>
                  {bodyText}
                </p>
                {!patternCfg && duration > 0 && (
                  <p className={`text-xs ${c.body} mt-1 font-medium`}>
                    Duration: {duration}s
                  </p>
                )}
                {patternCfg && (
                  <p className={`text-xs ${c.alert} mt-1 font-medium`}>
                    ⚠️ This activity is being recorded and flagged for review.
                  </p>
                )}
              </div>

              <AlertCircle className={`w-5 h-5 ${c.alert} flex-shrink-0`} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GazeWarning;
