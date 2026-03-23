/**
 * ProctorSidebar — live proctoring status panel.
 * Replaces the old ProctorPanel with real data from useProctoring.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, AlertTriangle, Shield, MonitorOff, Users } from 'lucide-react';
import { Decision } from '../../hooks/useProctoring.js';

const DECISION_CONFIG = {
  [Decision.CLEAN]:    { color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  label: 'Clean' },
  [Decision.WARNING]:  { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Warning' },
  [Decision.SUSPECT]:  { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Suspect' },
  [Decision.CHEATING]: { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'Cheating' },
};

const ProctorSidebar = ({
  videoRef,
  faceCount      = 0,
  isLookingAway  = false,
  gazeDirection  = 'center',
  score          = 0,
  decision       = Decision.CLEAN,
  tabSwitchCount = 0,
  violations     = [],
  isReady        = false,
}) => {
  const dc = DECISION_CONFIG[decision] ?? DECISION_CONFIG[Decision.CLEAN];

  const faceStatus =
    faceCount === 0 ? 'none' :
    faceCount > 1   ? 'multiple' : 'ok';

  const faceConfig = {
    none:     { icon: AlertTriangle, text: 'No Face Detected',       color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
    multiple: { icon: Users,         text: `${faceCount} Faces`,      color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    ok:       { icon: Eye,           text: 'Face Detected',           color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  }[faceStatus];

  const FaceIcon = faceConfig.icon;

  // Last 5 violations for the feed
  const recentViolations = violations.slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-white text-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">AI Proctoring</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
          <span className="text-xs font-medium text-blue-700">
            {isReady ? 'AI Monitoring Active' : 'Initialising…'}
          </span>
        </div>
      </div>

      {/* Video feed */}
      <div className="p-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded text-white text-xs">
            <Camera className="w-3 h-3" />
            <span>Live</span>
          </div>
          {isLookingAway && (
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none" />
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="px-4 space-y-2">
        {/* Face status */}
        <div className={`p-3 rounded-lg border ${faceConfig.bg} ${faceConfig.border}`}>
          <div className="flex items-center gap-2">
            <FaceIcon className={`w-4 h-4 ${faceConfig.color}`} />
            <span className={`font-medium ${faceConfig.color}`}>{faceConfig.text}</span>
          </div>
        </div>

        {/* Gaze status */}
        <div className={`p-3 rounded-lg border ${isLookingAway ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center gap-2">
            {isLookingAway
              ? <MonitorOff className="w-4 h-4 text-yellow-600" />
              : <Eye className="w-4 h-4 text-green-600" />
            }
            <span className={`font-medium ${isLookingAway ? 'text-yellow-600' : 'text-green-600'}`}>
              {isLookingAway ? `Looking ${gazeDirection}` : 'Looking at screen'}
            </span>
          </div>
        </div>
      </div>

      {/* Cheating score */}
      <div className="px-4 mt-3">
        <div className={`p-3 rounded-lg border ${dc.bg} ${dc.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-semibold ${dc.color}`}>Risk Score</span>
            <span className={`text-lg font-bold ${dc.color}`}>{score}/100</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                score >= 80 ? 'bg-red-500' :
                score >= 60 ? 'bg-orange-500' :
                score >= 30 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
          <p className={`text-xs mt-1 font-medium ${dc.color}`}>{dc.label}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-3 grid grid-cols-2 gap-2">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500">Warnings</p>
          <p className={`text-lg font-bold ${violations.length > 5 ? 'text-red-600' : violations.length > 0 ? 'text-yellow-600' : 'text-gray-800'}`}>
            {violations.length}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-xs text-gray-500">Tab Switches</p>
          <p className={`text-lg font-bold ${tabSwitchCount > 3 ? 'text-red-600' : tabSwitchCount > 0 ? 'text-yellow-600' : 'text-gray-800'}`}>
            {tabSwitchCount}
          </p>
        </div>
      </div>

      {/* Recent violations feed */}
      <AnimatePresence>
        {recentViolations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 mt-3 flex-1 overflow-y-auto"
          >
            <p className="text-xs font-semibold text-gray-500 mb-1">Recent Events</p>
            <div className="space-y-1">
              {recentViolations.map(v => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded px-2 py-1"
                >
                  <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0" />
                  <span className="truncate">{v.type.replace(/_/g, ' ')}</span>
                  <span className="ml-auto text-gray-400 shrink-0">
                    {new Date(v.epochMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
        <h3 className="text-xs font-semibold text-gray-700 mb-1">Exam Rules</h3>
        <ul className="space-y-1 text-xs text-gray-600">
          {['Keep face visible', 'No tab switching', 'Stay in fullscreen', 'No external devices'].map(r => (
            <li key={r} className="flex items-start gap-1.5">
              <span className="text-gray-400">•</span>{r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProctorSidebar;
