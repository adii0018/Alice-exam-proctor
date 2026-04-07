/**
 * AudioRiskIndicator — Shows current audio risk score and level
 * 
 * Displays in exam interface to show student their current audio risk status
 */

import React from 'react';
import { FiMic, FiMicOff, FiAlertTriangle, FiShield } from 'react-icons/fi';

const AudioRiskIndicator = ({
  isMonitoring,
  riskScore,
  riskLevel,
  className = ""
}) => {
  const getRiskColor = () => {
    if (riskScore <= 30) return 'text-green-600 dark:text-green-400';
    if (riskScore <= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (riskScore <= 90) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskBgColor = () => {
    if (riskScore <= 30) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (riskScore <= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (riskScore <= 90) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getRiskIcon = () => {
    if (!isMonitoring) return <FiMicOff className="w-4 h-4" />;
    if (riskScore <= 30) return <FiShield className="w-4 h-4" />;
    return <FiAlertTriangle className="w-4 h-4" />;
  };

  const getProgressBarColor = () => {
    if (riskScore <= 30) return 'bg-green-500';
    if (riskScore <= 60) return 'bg-yellow-500';
    if (riskScore <= 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!isMonitoring) {
    return (
      <div className={`p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center gap-2">
          <FiMicOff className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Audio Monitoring: Disabled
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${getRiskBgColor()} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getRiskIcon()}
          <span className={`text-sm font-medium ${getRiskColor()}`}>
            Audio Risk: {riskLevel}
          </span>
        </div>
        <span className={`text-xs font-mono ${getRiskColor()}`}>
          {riskScore}/100
        </span>
      </div>
      
      {/* Risk Score Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-500 ease-out ${getProgressBarColor()}`}
          style={{ width: `${Math.min(100, riskScore)}%` }}
        />
      </div>
      
      {/* Risk Level Descriptions */}
      <div className="mt-2">
        <p className={`text-xs ${getRiskColor()}`}>
          {riskScore <= 30 && "Keep it up! No audio violations detected."}
          {riskScore > 30 && riskScore <= 60 && "Minor audio activity detected. Please remain silent."}
          {riskScore > 60 && riskScore <= 90 && "Suspicious audio activity. Admin has been notified."}
          {riskScore > 90 && "High risk detected. Exam flagged for review."}
        </p>
      </div>
    </div>
  );
};

export default AudioRiskIndicator;