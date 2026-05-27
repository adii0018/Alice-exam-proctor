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
  BookOpen,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle, isMobile }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Exams', path: '/admin/exams' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { icon: FileSearch, label: 'Audit Logs', path: '/admin/audit' },
    { icon: BookOpen, label: 'Blogs', path: '/admin/blogs' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className={`fixed left-0 top-0 h-screen bg-[#0d1117] border-r border-[#30363d] z-30 ${
        isMobile ? 'w-64' : ''
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#30363d]">
          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ea043] to-[#3fb950] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold text-[#e6edf3]">
                  Alice Admin
                </h1>
                <p className="text-xs text-[#8b949e]">Super Admin</p>
              </div>
            )}
          </motion.div>
          
          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-[#161b22] transition-colors"
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-[#8b949e]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#8b949e]" />
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
                      ? 'bg-[#161b22] border border-[#2ea043] text-[#3fb950] shadow-[0_0_10px_rgba(46,160,67,0.15)]'
                      : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-[#3fb950]' : 'text-[#8b949e]'
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
        <div className="p-4 border-t border-[#30363d]">
          {isOpen ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#e6edf3] mb-1">
                System Status
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
                <span className="text-xs text-[#8b949e]">
                  All systems operational
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
