import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings, Save, AlertTriangle, Shield, Zap, Bell } from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    violationThreshold: 5,
    autoSubmitEnabled: true,
    autoSubmitThreshold: 10,
    aiSensitivity: 'medium',
    maintenanceMode: false,
    emailNotifications: true,
    webhookUrl: '',
    sessionTimeout: 30,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setPendingChanges(true);
  };

  const handleSave = async () => {
    try {
      await fetch('/api/admin/settings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      });
      setPendingChanges(false);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure system-wide proctoring rules and behavior
            </p>
          </div>
          {pendingChanges && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {/* Warning Banner */}
        {settings.maintenanceMode && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300">
                  Maintenance Mode Active
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  The system is currently in maintenance mode. Users cannot access exams.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Violation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Violation Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure violation thresholds and auto-submit behavior
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Violation Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Violation Threshold
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.violationThreshold}
                  onChange={(e) => handleChange('violationThreshold', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                  {settings.violationThreshold}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Number of violations before flagging a student
              </p>
            </div>

            {/* Auto Submit */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Auto-Submit on Violations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Automatically submit exam after threshold violations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSubmitEnabled}
                  onChange={(e) => handleChange('autoSubmitEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.autoSubmitEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-Submit Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.autoSubmitThreshold}
                  onChange={(e) => handleChange('autoSubmitThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Proctoring Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure AI detection sensitivity
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              AI Sensitivity Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleChange('aiSensitivity', level)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.aiSensitivity === level
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {level}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {level === 'low' && 'Fewer false positives'}
                    {level === 'medium' && 'Balanced detection'}
                    {level === 'high' && 'Maximum security'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Configuration
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                General system settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Maintenance Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Disable all exam access for system maintenance
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Save Settings"
          message="Are you sure you want to save these system settings? This will affect all users."
          onConfirm={handleSave}
          onCancel={() => setShowConfirm(false)}
          type="primary"
        />
      )}
    </AdminLayout>
  );
};

export default SystemSettings;
