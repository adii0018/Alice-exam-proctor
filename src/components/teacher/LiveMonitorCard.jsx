import { motion } from 'framer-motion';
import { Users, AlertTriangle, Eye } from 'lucide-react';

export default function LiveMonitorCard({ exam }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all relative overflow-hidden"
    >
      {/* Live Pulse */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-1">{exam.name}</h3>
        <p className="text-sm text-gray-500">{exam.code}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">Students</span>
          </div>
          <span className="font-semibold text-gray-900">{exam.activeStudents}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Violations</span>
          </div>
          <span className="font-semibold text-orange-600">{exam.violations}</span>
        </div>
      </div>

      <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        View Live
      </button>
    </motion.div>
  );
}
