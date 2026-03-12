import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import PerformanceChart from '../../components/teacher/PerformanceChart';
import { TrendingUp, Award, Users, Target } from 'lucide-react';
import TeacherLayout from '../../components/teacher/TeacherLayout';

export default function Results() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll();
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.submissions?.length || 0), 0);
  const avgScore = 75; // Mock - calculate from actual submissions
  const passRate = 82; // Mock

  const stats = [
    { icon: Users, label: 'Total Submissions', value: totalSubmissions, color: 'blue' },
    { icon: Award, label: 'Average Score', value: `${avgScore}%`, color: 'green' },
    { icon: Target, label: 'Pass Rate', value: `${passRate}%`, color: 'purple' },
    { icon: TrendingUp, label: 'Improvement', value: '+12%', color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="Results">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Results & Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track student performance and exam statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Recent Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Exam Results</h3>
        </div>
        <div className="p-6">
          {quizzes.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">No results available yet</p>
          ) : (
            <div className="space-y-4">
              {quizzes.slice(0, 5).map((quiz) => (
                <div key={quiz._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.submissions?.length || 0} submissions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">--</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </motion.div>
    </TeacherLayout>
  );
}
