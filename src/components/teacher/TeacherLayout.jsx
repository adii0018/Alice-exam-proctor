import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherNavbar from './TeacherNavbar';

export default function TeacherLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Auto-detect title from route if not provided
  const getTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path === '/teacher') return 'Dashboard';
    if (path === '/teacher/exams') return 'Exams';
    if (path === '/teacher/students') return 'Students';
    if (path === '/teacher/live') return 'Live Monitoring';
    if (path === '/teacher/results') return 'Results';
    if (path === '/teacher/violations') return 'Violations';
    if (path === '/teacher/profile') return 'Profile';
    if (path === '/teacher/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <TeacherSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="transition-all"
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      >
        <TeacherNavbar
          title={getTitle()}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
