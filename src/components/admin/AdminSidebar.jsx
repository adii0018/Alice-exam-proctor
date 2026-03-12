import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Shield,
  AlertTriangle,
  Settings,
  FileSearch,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle, isMobile }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Exams', path: '/admin/exams' },
    { icon: Building2, label: 'Institutions', path: '/admin/institutions' },
    { icon: Shield, label: 'Proctoring Logs', path: '/admin/proctoring' },
    { icon: AlertTriangle, label: 'Violations', path: '/admin/violations' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: FileSearch, label: 'Audit Logs', path: '/admin/audit' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 ${
        isMobile ? 'w-64' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Alice Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
            )}
          </motion.div>
          
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    {isOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isOpen ? (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                System Status
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  All systems operational
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
