import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiLock, FiMonitor, FiMoon, FiGlobe, FiShield } from 'react-icons/fi'
import DashboardLayout from '../../components/student/DashboardLayout'
import SoundSettings from '../../components/common/SoundSettings'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      examReminders: true,
      violationAlerts: true,
      scoreUpdates: true,
      emailNotifications: false
    },
    privacy: {
      shareProgress: false,
      publicProfile: false
    },
    proctoring: {
      cameraEnabled: true,
      microphoneEnabled: true,
      screenRecording: true
    },
    appearance: {
      darkMode: false,
      language: 'en'
    }
  })

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }))
    toast.success('Setting updated successfully')
  }

  const SettingToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`
          relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0
          ${checked ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'}
        `}
      >
        <motion.span
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  )

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <FiBell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Exam Reminders"
              description="Get notified before exams start"
              checked={settings.notifications.examReminders}
              onChange={() => handleToggle('notifications', 'examReminders')}
            />
            <SettingToggle
              label="Violation Alerts"
              description="Receive alerts for proctoring violations"
              checked={settings.notifications.violationAlerts}
              onChange={() => handleToggle('notifications', 'violationAlerts')}
            />
            <SettingToggle
              label="Score Updates"
              description="Get notified when scores are published"
              checked={settings.notifications.scoreUpdates}
              onChange={() => handleToggle('notifications', 'scoreUpdates')}
            />
            <SettingToggle
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.notifications.emailNotifications}
              onChange={() => handleToggle('notifications', 'emailNotifications')}
            />
          </div>
        </motion.div>

        {/* Proctoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <FiMonitor className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Proctoring Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure AI monitoring preferences</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Camera Monitoring"
              description="Enable camera for face detection"
              checked={settings.proctoring.cameraEnabled}
              onChange={() => handleToggle('proctoring', 'cameraEnabled')}
            />
            <SettingToggle
              label="Microphone Monitoring"
              description="Enable audio monitoring during exams"
              checked={settings.proctoring.microphoneEnabled}
              onChange={() => handleToggle('proctoring', 'microphoneEnabled')}
            />
            <SettingToggle
              label="Screen Recording"
              description="Allow screen recording during exams"
              checked={settings.proctoring.screenRecording}
              onChange={() => handleToggle('proctoring', 'screenRecording')}
            />
          </div>
        </motion.div>

        {/* Sound Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SoundSettings />
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <FiShield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control your privacy settings</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Share Progress"
              description="Allow teachers to see your progress"
              checked={settings.privacy.shareProgress}
              onChange={() => handleToggle('privacy', 'shareProgress')}
            />
            <SettingToggle
              label="Public Profile"
              description="Make your profile visible to others"
              checked={settings.privacy.publicProfile}
              onChange={() => handleToggle('privacy', 'publicProfile')}
            />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
              <FiMoon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize your experience</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingToggle
              label="Dark Mode"
              description="Switch to dark theme"
              checked={settings.appearance.darkMode}
              onChange={() => handleToggle('appearance', 'darkMode')}
            />
            <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <FiGlobe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <p className="font-medium text-gray-900 dark:text-white">Language</p>
              </div>
              <select
                value={settings.appearance.language}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, language: e.target.value }
                  }))
                  toast.success('Language updated')
                }}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <FiLock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account security</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left">
              Change Password
            </button>
            <button className="w-full py-3 px-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-left">
              Enable Two-Factor Authentication
            </button>
            <button className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left">
              View Login History
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
