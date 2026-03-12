import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FileText,
  Search,
  Filter,
  StopCircle,
  Lock,
  Eye,
  Download,
  Clock,
  User,
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ExamsManagement = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchQuery, statusFilter]);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/admin/exams/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setExams(data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  };

  const filterExams = () => {
    let filtered = [...exams];

    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((exam) => exam.status === statusFilter);
    }

    setFilteredExams(filtered);
  };

  const handleAction = (exam, action) => {
    setSelectedExam(exam);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      const endpoint = `/api/admin/exams/${selectedExam._id}/${actionType}/`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchExams();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      stopped: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[status] || styles.scheduled;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Exam Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and control all exams across the platform
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Download className="w-4 h-4" />
            <span>Export Exams</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Exams', value: exams.length, color: 'blue' },
            { label: 'Live', value: exams.filter(e => e.status === 'live').length, color: 'green' },
            { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: 'purple' },
            { label: 'Flagged', value: exams.filter(e => e.flagged).length, color: 'red' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="stopped">Stopped</option>
            </select>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {exam.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {exam.code}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        exam.status || 'scheduled'
                      )}`}
                    >
                      {exam.status || 'scheduled'}
                    </span>
                  </div>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Teacher: {exam.teacher_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {exam.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>Questions: {exam.questions?.length || 0}</span>
                </div>
              </div>

              {/* Description */}
              {exam.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {exam.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleAction(exam, 'view')}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View</span>
                </button>
                {exam.status === 'live' && (
                  <button
                    onClick={() => handleAction(exam, 'force-stop')}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Stop</span>
                  </button>
                )}
                <button
                  onClick={() => handleAction(exam, 'lock')}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Lock</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No exams found</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title={`Confirm ${actionType}`}
          message={`Are you sure you want to ${actionType} "${selectedExam?.title}"? This action will be logged.`}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmModal(false)}
          type="danger"
        />
      )}
    </AdminLayout>
  );
};

export default ExamsManagement;
