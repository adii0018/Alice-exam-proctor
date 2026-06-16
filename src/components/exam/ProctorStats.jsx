import PropTypes from 'prop-types';

const ProctorStats = ({ violationCount, tabSwitchCount, fullscreenStrikes }) => {
  return (
    <div className="flex-1 p-4">
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Warnings</span>
            <span className={`text-lg font-bold ${
              violationCount >= 7 ? 'text-red-600' : 
              violationCount > 0 ? 'text-yellow-600' : 
              'text-gray-900'
            }`}>
              {violationCount}
            </span>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tab Switches</span>
            <span className={`text-lg font-bold ${
              tabSwitchCount > 3 ? 'text-red-600' : 
              tabSwitchCount > 0 ? 'text-yellow-600' : 
              'text-gray-900'
            }`}>
              {tabSwitchCount}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${
          fullscreenStrikes >= 2 ? 'bg-red-50 border-red-300' :
          fullscreenStrikes === 1 ? 'bg-yellow-50 border-yellow-300' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Fullscreen Strikes</span>
            <span className={`text-lg font-bold ${
              fullscreenStrikes >= 2 ? 'text-red-600' :
              fullscreenStrikes === 1 ? 'text-yellow-600' :
              'text-gray-900'
            }`}>
              {fullscreenStrikes}/3
            </span>
          </div>
          {fullscreenStrikes > 0 && (
            <p className={`text-xs mt-1 ${
              fullscreenStrikes >= 2 ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {fullscreenStrikes >= 2
                ? '🚨 Next violation = exam termination!'
                : '⚠️ Return to fullscreen immediately'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ProctorStats.propTypes = {
  violationCount: PropTypes.number.isRequired,
  tabSwitchCount: PropTypes.number.isRequired,
  fullscreenStrikes: PropTypes.number.isRequired,
};

export default ProctorStats;
