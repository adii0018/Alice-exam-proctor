import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import SystemHealthMonitor from '../../components/admin/SystemHealthMonitor';
import LiveActivityFeed from '../../components/admin/LiveActivityFeed';
import ViolationChart from '../../components/admin/ViolationChart';
import ExamStatusChart from '../../components/admin/ExamStatusChart';
import { useWebSocket } from '../../hooks/useWebSocket';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeExams: 0,
    institutions: 0,
    violationsToday: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });

  const [systemHealth, setSystemHealth] = useState({
    websocket: 'connected',
    aiService: 'operational',
    database: 'healthy',
    storage: 'optimal',
  });

  const { isConnected } = useWebSocket('admin-dashboard');

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              System-level monitoring and control
            </p>
          </div>
          <SystemHealthMonitor health={systemHealth} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change="+12%"
            trend="up"
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Active Exams"
            value={stats.activeExams}
            change="Live"
            trend="neutral"
            icon="📝"
            color="purple"
            pulse
          />
          <StatCard
            title="Institutions"
            value={stats.institutions}
            change="+3 this month"
            trend="up"
            icon="🏛️"
            color="indigo"
          />
          <StatCard
            title="Violations Today"
            value={stats.violationsToday}
            change="-8%"
            trend="down"
            icon="⚠️"
            color="red"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Teachers"
            value={stats.totalTeachers}
            subtitle="Active educators"
            icon="👨‍🏫"
            color="green"
          />
          <StatCard
            title="Students"
            value={stats.totalStudents}
            subtitle="Enrolled learners"
            icon="🎓"
            color="cyan"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViolationChart />
          <ExamStatusChart />
        </div>

        {/* Live Activity Feed */}
        <LiveActivityFeed />
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
