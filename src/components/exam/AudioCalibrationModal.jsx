/**
 * AudioCalibrationModal — UI for ambient noise calibration
 * 
 * Shows during exam setup to calibrate audio detection to room environment
 */

import React from 'react';
import { FiMic, FiMicOff, FiCheck, FiAlertTriangle } from 'react-icons/fi';

const AudioCalibrationModal = ({
  isOpen,
  isCalibrating,
  calibrationProgress,
  isCalibrated,
  onStartCalibration,
  onClose,
  onContinue
}) => {
  if (!isOpen) return null;

  const getStatusIcon = () => {
    if (isCalibrated) return <FiCheck className="w-8 h-8 text-green-500" />;
    if (isCalibrating) return <FiMic className="w-8 h-8 text-blue-500 animate-pulse" />;
    return <FiMicOff className="w-8 h-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isCalibrated) return "Calibration Complete";
    if (isCalibrating) return "Calibrating Audio...";
    return "Audio Calibration Required";
  };

  const getStatusDescription = () => {
    if (isCalibrated) {
      return "Your room's audio environment has been calibrated. The system will now accurately detect voice activity during your exam.";
    }
    if (isCalibrating) {
      return "Please remain completely silent while we measure your room's background noise level. This helps us distinguish between normal room sounds and actual speech.";
    }
    return "Before starting your exam, we need to calibrate the audio monitoring system to your room's environment. This ensures accurate detection and prevents false alerts from background noise like AC or fans.";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {getStatusText()}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {getStatusDescription()}
          </p>
        </div>

        {/* Progress Bar (only during calibration) */}
        {isCalibrating && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(calibrationProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${calibrationProgress}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Measuring ambient noise... {Math.ceil((100 - calibrationProgress) * 0.03)}s remaining
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isCalibrated && !isCalibrating && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Calibration Instructions
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Ensure you're in your exam environment</li>
                  <li>• Keep normal room conditions (AC, fans, etc.)</li>
                  <li>• Stay completely silent for 3 seconds</li>
                  <li>• Don't move or make any sounds</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isCalibrated && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                  Ready for Exam
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Audio monitoring is now calibrated to your environment. The system will accurately detect voice activity while ignoring background noise.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isCalibrated && !isCalibrating && (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Skip
              </button>
              <button
                onClick={onStartCalibration}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FiMic className="w-4 h-4" />
                Start Calibration
              </button>
            </>
          )}
          
          {isCalibrating && (
            <button
              disabled
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              Calibrating... Please Stay Silent
            </button>
          )}
          
          {isCalibrated && (
            <button
              onClick={onContinue}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiCheck className="w-4 h-4" />
              Continue to Exam
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This calibration ensures accurate audio monitoring and reduces false alerts from environmental sounds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioCalibrationModal;