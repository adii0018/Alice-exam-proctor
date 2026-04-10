import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, MonitorPlay, 
  BarChart3, AlertTriangle, UserCircle, Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { darkMode } = useTheme();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/teacher' },
    { icon: FileText, label: 'Exams', path: '/teacher/exams' },
    { icon: MonitorPlay, label: 'Live', path: '/teacher/live' },
    { icon: AlertTriangle, label: 'Alerts', path: '/teacher/violations' },
    { icon: UserCircle, label: 'Profile', path: '/teacher/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const gh = {
    bg: darkMode ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.85)',
    border: darkMode ? '#21262d' : 'rgba(229,231,235,0.5)',
    activeText: darkMode ? '#3fb950' : '#059669',
    activeBg: darkMode ? 'rgba(46,160,67,0.15)' : 'rgba(5,150,105,0.1)',
    inactiveText: darkMode ? '#8b949e' : '#6b7280',
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        backgroundColor: gh.bg,
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${gh.border}`,
      }}
    >
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl transition-colors"
                style={{
                  backgroundColor: active ? gh.activeBg : 'transparent',
                }}
              >
                <Icon 
                  style={{ 
                    width: 22, 
                    height: 22, 
                    color: active ? gh.activeText : gh.inactiveText 
                  }} 
                />
              </motion.div>
              <span 
                className="text-xs font-medium"
                style={{ color: active ? gh.activeText : gh.inactiveText }}
              >
                {item.label}
              </span>
              
              {active && (
                <motion.div
                  layoutId="teacherMobileActiveIndicator"
                  className="absolute -top-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: gh.activeText }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
