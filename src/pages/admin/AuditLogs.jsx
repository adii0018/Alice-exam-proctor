import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FileSearch,
  Shield,
  UserX,
  Settings,
  AlertTriangle,
  Download,
  Filter,
  Clock,
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    action: 'all',
    admin: 'all',
    dateRange: 'all',
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      // Mock data for demo
      setLogs([
        {
          _id: '1',
          action: 'user_ban',
          admin_id: 'admin1',
          admin_name: 'Super Admin',
          target: 'john.doe@example.com',
          timestamp: new Date().toISOString(),
          details: 'User banned for repeated violations',
        },
        {
          _id: '2',
          action: 'exam_force_stop',
          admin_id: 'admin1',
          admin_name: 'Super Admin',
          target: 'Math Final Exam',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Exam stopped due to technical issues',
        },
        {
          _id: '3',
          action: 'settings_change',
          admin_id: 'admin1',
          admin_name: 'Super Admin',
          target: 'Violation Thresholds',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'Updated violation threshold from 3 to 5',
        },
      ]);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    if (filters.action !== 'all') {
      filtered = filtered.filter((log) => log.action === filters.action);
    }

    if (filters.admin !== 'all') {
      filtered = filtered.filter((log) => log.admin_id === filters.admin);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    const icons = {
      user_ban: UserX,
      exam_force_stop: AlertTriangle,
      settings_change: Settings,
      rule_change: Shield,
    };
    return icons[action] || FileSearch;
  };

  const getActionColor = (action) => {
    const colors = {
      user_ban: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      exam_force_stop: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      settings_change: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      rule_change: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[action] || 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Admin', 'Target', 'Details'],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.admin_name,
        log.target,
        log.details,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Audit Logs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track all administrative actions and system changes
            </p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                Read-Only Audit Trail
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                All administrative actions are permanently logged for security and compliance.
                Logs cannot be modified or deleted.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Actions</option>
              <option value="user_ban">User Ban</option>
              <option value="exam_force_stop">Exam Force Stop</option>
              <option value="settings_change">Settings Change</option>
              <option value="rule_change">Rule Change</option>
            </select>

            <select
              value={filters.admin}
              onChange={(e) => setFilters({ ...filters, admin: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Admins</option>
              <option value="admin1">Super Admin</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Logs Timeline */}
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const Icon = getActionIcon(log.action);
            return (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${getActionColor(
                      log.action
                    )}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {log.action.replace(/_/g, ' ').toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          by {log.admin_name}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Target:
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {log.target}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
