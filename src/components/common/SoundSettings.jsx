import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import soundManager from '../../utils/soundEffects';

const SoundSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // Load saved preferences
    const savedEnabled = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    
    if (savedEnabled !== null) {
      const enabled = savedEnabled === 'true';
      setSoundEnabled(enabled);
      if (enabled) {
        soundManager.enable();
      } else {
        soundManager.disable();
      }
    }
    
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      soundManager.setVolume(vol);
    }
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    
    if (newState) {
      soundManager.enable();
      soundManager.playNotification();
    } else {
      soundManager.disable();
    }
    
    localStorage.setItem('soundEnabled', newState.toString());
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
    localStorage.setItem('soundVolume', newVolume.toString());
    
    // Play test sound
    if (soundEnabled) {
      soundManager.playClick();
    }
  };

  const testSound = (type) => {
    if (!soundEnabled) return;
    
    switch(type) {
      case 'notification':
        soundManager.playNotification();
        break;
      case 'warning':
        soundManager.playWarning();
        break;
      case 'violation':
        soundManager.playViolationAlert();
        break;
      case 'success':
        soundManager.playSuccess();
        break;
    }
  };

  const getVolumeIcon = () => {
    if (!soundEnabled) return VolumeX;
    if (volume < 0.3) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sound Effects</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure audio alerts and notifications
          </p>
        </div>
        <button
          onClick={handleToggleSound}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              soundEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {soundEnabled && (
        <div className="space-y-6">
          {/* Volume Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <VolumeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                Volume
              </label>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Test Sounds */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Test Sounds
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => testSound('notification')}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
              >
                🔔 Notification
              </button>
              <button
                onClick={() => testSound('warning')}
                className="px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors text-sm font-medium"
              >
                ⚠️ Warning
              </button>
              <button
                onClick={() => testSound('violation')}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
              >
                🚨 Violation
              </button>
              <button
                onClick={() => testSound('success')}
                className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
              >
                ✅ Success
              </button>
            </div>
          </div>

          {/* Sound Info */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              When sounds play:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Violation alerts when cheating is detected</li>
              <li>• Warning sounds for multiple faces or tab switches</li>
              <li>• Timer ticks in the last 10 seconds</li>
              <li>• Success sounds when exam is submitted</li>
              <li>• Click sounds for better feedback</li>
            </ul>
          </div>
        </div>
      )}

      {!soundEnabled && (
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
          <VolumeX className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sound effects are currently disabled
          </p>
        </div>
      )}
    </div>
  );
};

export default SoundSettings;
