import { motion } from 'framer-motion';
import { Camera, Mic, Eye, AlertTriangle, Shield } from 'lucide-react';

const ProctorPanel = ({ 
  videoRef, 
  faceStatus, 
  violationCount,
  tabSwitchCount,
  faceCount = 0
}) => {
  const getFaceStatusConfig = () => {
    switch (faceStatus) {
      case 'detected':
        return {
          icon: Eye,
          text: `Face Detected (${faceCount})`,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200'
        };
      case 'multiple':
        return {
          icon: AlertTriangle,
          text: `Multiple Faces (${faceCount})`,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200'
        };
      case 'none':
        return {
          icon: AlertTriangle,
          text: 'No Face Detected',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      default:
        return {
          icon: Eye,
          text: 'Initializing...',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  const statusConfig = getFaceStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">AI Proctoring</h2>
        </div>
        
        {/* AI Monitoring Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
          <span className="text-xs font-medium text-blue-700">AI Monitoring Active</span>
        </div>
      </div>

      {/* Video Feed */}
      <div className="p-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Camera Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs">
            <Camera className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="px-4 space-y-3">
        {/* Face Detection Status */}
        <div className={`p-3 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.text}
              </p>
            </div>
          </div>
        </div>

        {/* Microphone Status */}
        <div className="p-3 rounded-lg border bg-green-50 border-green-200">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600">
                Microphone Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
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
        </div>
      </div>

      {/* Rules Reminder */}
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
    </div>
  );
};

export default ProctorPanel;
