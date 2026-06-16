import PropTypes from 'prop-types';

const RulesReminder = () => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">Exam Rules</h3>
      <ul className="space-y-1.5 text-xs text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Keep your face visible at all times</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Do not switch tabs or minimize window</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>No external materials or devices</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Stay in fullscreen mode</span>
        </li>
      </ul>
    </div>
  );
};

export default RulesReminder;
