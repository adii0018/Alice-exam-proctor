import { motion } from 'framer-motion';
import { X, Shield, Eye, Monitor, AlertTriangle } from 'lucide-react';

const RulesModal = ({ rules, onClose }) => {
  const defaultRules = [
    {
      icon: Eye,
      title: 'Face Visibility',
      description: 'Keep your face clearly visible to the camera at all times. Multiple faces or no face detection will trigger warnings.'
    },
    {
      icon: Monitor,
      title: 'Fullscreen Mode',
      description: 'Remain in fullscreen mode throughout the exam. Exiting fullscreen will be recorded as a violation.'
    },
    {
      icon: AlertTriangle,
      title: 'No Tab Switching',
      description: 'Do not switch tabs, minimize the window, or navigate away from the exam page. All attempts will be logged.'
    },
    {
      icon: Shield,
      title: 'No External Materials',
      description: 'Use of external materials, devices, or assistance is strictly prohibited and will result in exam termination.'
    }
  ];

  const displayRules = rules.length > 0 ? rules : defaultRules;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Exam Rules & Guidelines
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Important Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              Violation of exam rules may result in automatic submission or disqualification. 
              Maximum of 10 warnings allowed.
            </p>
          </div>

          {/* Rules List */}
          <div className="space-y-4">
            {displayRules.map((rule, index) => {
              const Icon = rule.icon || Shield;
              
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Additional Guidelines
            </h3>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Ensure stable internet connection throughout the exam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Use a quiet, well-lit environment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Close all unnecessary applications and browser tabs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Have a valid ID ready if requested</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RulesModal;
