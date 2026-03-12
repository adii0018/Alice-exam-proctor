import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  AlertTriangle,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  FileText,
} from 'lucide-react';

const ViolationsManagement = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    status: 'all',
    dateRange: 'all',
  });

  useEffect(() => {
    fetchViolations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [violations, filters]);

  const fetchViolations = async () => {
    try {
      const response = await fetch('/api/admin/violations/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setViolations(data.violations || []);
    } catch (error) {
      console.error('Failed to fetch violations:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...violations];

    if (filters.type !== 'all') {
      filtered = filtered.filter((v) => v.violation_type === filters.type);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter((v) => v.severity === filters.severity);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    setFilteredViolations(filtered);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      critical: 'bg-red-600 text-white dark:bg-red-700',
    };
    return colors[severity] || colors.medium;
  };

  const getViolationIcon = (type) => {
    const icons = {
      'multiple-faces': '👥',
      'no-face': '❌',
      'gaze-away': '👀',
      'tab-switch': '🔄',
      'suspicious-object': '📱',
    };
    return icons[type] || '⚠️';
  };

  const exportViolations = () => {
    const csv = [
      ['Timestamp', 'Student', 'Exam', 'Type', 'Severity', 'Status'],
      ...filteredViolations.map((v) => [
        new Date(v.timestamp).toLocaleString(),
        v.student_name || 'Unknown',
        v.exam_title || 'Unknown',
        v.violation_type,
        v.severity,
        v.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `violations-${Date.now()}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Violations Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage all proctoring violations
            </p>
          </div>
          <button
            onClick={exportViolations}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['low', 'medium', 'high', 'critical'].map((severity) => {
            const count = violations.filter((v) => v.severity === severity).length;
            return (
              <div
                key={severity}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {severity}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {count}
                    </p>
                  </div>
                  <AlertTriangle
                    className={`w-8 h-8 ${
                      severity === 'critical'
                        ? 'text-red-600'
                        : severity === 'high'
                        ? 'text-orange-600'
                        : severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-yellow-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="multiple-faces">Multiple Faces</option>
              <option value="no-face">No Face</option>
              <option value="gaze-away">Gaze Away</option>
              <option value="tab-switch">Tab Switch</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
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

        {/* Violations List */}
        <div className="space-y-3">
          {filteredViolations.map((violation) => (
            <motion.div
              key={violation._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className="text-4xl">
                    {getViolationIcon(violation.violation_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {violation.violation_type?.replace(/-/g, ' ').toUpperCase()}
                      </h3>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          violation.severity
                        )}`}
                      >
                        {violation.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>Student: {violation.student_name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span>Exam: {violation.exam_title || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {violation.timestamp
                            ? new Date(violation.timestamp).toLocaleString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {violation.metadata && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {JSON.stringify(violation.metadata)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}

          {filteredViolations.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No violations found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViolationsManagement;
