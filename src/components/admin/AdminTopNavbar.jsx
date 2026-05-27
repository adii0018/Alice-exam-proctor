import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  User,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import UserAvatar from '../common/UserAvatar';
import { AVATAR_STYLES } from '../../utils/avatarGenerator';

const AdminTopNavbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'violation', message: 'High severity violation detected', time: '2m ago' },
    { id: 2, type: 'exam', message: 'New exam started by Prof. Smith', time: '5m ago' },
    { id: 3, type: 'system', message: 'System backup completed', time: '1h ago' },
  ]);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d] z-20">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-[#161b22] transition-colors"
          >
            <Menu className="w-5 h-5 text-[#8b949e]" />
          </button>

          {/* Global Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 lg:w-96 pl-10 pr-4 py-2 bg-[#161b22] border-0 rounded-lg text-sm focus:ring-1 focus:ring-[#2ea043] text-[#e6edf3] placeholder-[#8b949e]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* System Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[rgba(46,160,67,0.1)] rounded-lg">
            <Activity className="w-4 h-4 text-[#3fb950]" />
            <span className="text-xs font-medium text-[#3fb950]">
              Operational
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-[#161b22] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#8b949e]" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-[#0d1117] rounded-xl shadow-xl border border-[#30363d] overflow-hidden"
                >
                  <div className="p-4 border-b border-[#30363d]">
                    <h3 className="font-semibold text-[#e6edf3]">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-[#161b22] transition-colors border-b border-[#30363d] last:border-0"
                      >
                        <p className="text-sm text-[#e6edf3]">
                          {notif.message}
                        </p>
                        <p className="text-xs text-[#8b949e] mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[#161b22] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#8b949e]" />
            ) : (
              <Moon className="w-5 h-5 text-[#8b949e]" />
            )}
          </button>

          {/* Admin Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#161b22] transition-colors"
            >
              <UserAvatar
                user={{ username: 'admin', email: 'admin@alice.com' }}
                size={32}
                showBorder={false}
                fallbackGradient="linear-gradient(135deg, #3b82f6, #9333ea)"
              />
              <span className="hidden md:block text-sm font-medium text-[#e6edf3]">
                Admin
              </span>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-[#0d1117] rounded-xl shadow-xl border border-[#30363d] overflow-hidden"
                >
                  <div className="p-4 border-b border-[#30363d]">
                    <p className="font-semibold text-[#e6edf3]">
                      Super Admin
                    </p>
                    <p className="text-xs text-[#8b949e]">
                      admin@alice.com
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#161b22] transition-colors text-left">
                      <Settings className="w-4 h-4 text-[#8b949e]" />
                      <span className="text-sm text-[#8b949e]">
                        Settings
                      </span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Logout
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNavbar;
