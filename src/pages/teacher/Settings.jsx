import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, User, Bell, Shield, Moon, Globe, Lock, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import TeacherLayout from '../../components/teacher/TeacherLayout';

export default function Settings() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [settings, setSettings] = useState({
    profile: {
      name: user?.username || '',
      email: user?.email || '',
    },
    notifications: {
      examAlerts: true,
      violationAlerts: true,
      studentSubmissions: true,
      emailNotifications: false
    },
    proctoring: {
      autoFlagViolations: true,
      strictMode: false,
      recordSessions: true
    },
    privacy: {
      shareStatistics: false,
      publicProfile: false
    },
    appearance: {
      language: 'en'
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    toast.success('Setting updated successfully');
  };

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
  };

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
          ${checked ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <motion.span
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );

  return (
    <TeacherLayout title="Settings">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, name: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, email: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Exam Alerts"
              description="Get notified when exams start or end"
              checked={settings.notifications.examAlerts}
              onChange={() => handleToggle('notifications', 'examAlerts')}
            />
            <SettingToggle
              label="Violation Alerts"
              description="Receive alerts for proctoring violations"
              checked={settings.notifications.violationAlerts}
              onChange={() => handleToggle('notifications', 'violationAlerts')}
            />
            <SettingToggle
              label="Student Submissions"
              description="Get notified when students submit exams"
              checked={settings.notifications.studentSubmissions}
              onChange={() => handleToggle('notifications', 'studentSubmissions')}
            />
            <SettingToggle
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.notifications.emailNotifications}
              onChange={() => handleToggle('notifications', 'emailNotifications')}
            />
          </div>
        </motion.div>

        {/* Proctoring Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Proctoring Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure AI monitoring preferences</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Auto-Flag Violations"
              description="Automatically flag suspicious behavior"
              checked={settings.proctoring.autoFlagViolations}
              onChange={() => handleToggle('proctoring', 'autoFlagViolations')}
            />
            <SettingToggle
              label="Strict Mode"
              description="Enable stricter violation detection"
              checked={settings.proctoring.strictMode}
              onChange={() => handleToggle('proctoring', 'strictMode')}
            />
            <SettingToggle
              label="Record Sessions"
              description="Record exam sessions for review"
              checked={settings.proctoring.recordSessions}
              onChange={() => handleToggle('proctoring', 'recordSessions')}
            />
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control your privacy settings</p>
            </div>
          </div>
          <div className="space-y-2">
            <SettingToggle
              label="Share Statistics"
              description="Allow sharing of exam statistics"
              checked={settings.privacy.shareStatistics}
              onChange={() => handleToggle('privacy', 'shareStatistics')}
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
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <div className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <p className="font-medium text-gray-900 dark:text-white">Language</p>
              </div>
              <select
                value={settings.appearance.language}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, language: e.target.value }
                  }));
                  toast.success('Language updated');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
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
      </motion.div>
    </TeacherLayout>
  );
}
