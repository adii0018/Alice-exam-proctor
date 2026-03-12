import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const severityConfig = {
  Low: { color: 'text-yellow-600 bg-yellow-50', icon: AlertCircle },
  Medium: { color: 'text-orange-600 bg-orange-50', icon: AlertTriangle },
  High: { color: 'text-red-600 bg-red-50', icon: AlertOctagon },
};

export default function ViolationsTable({ violations }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Exam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Violation Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {violations.map((violation, index) => {
              const SeverityIcon = severityConfig[violation.severity].icon;
              
              return (
                <motion.tr
                  key={violation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {violation.student[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{violation.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {violation.exam}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {violation.type}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${severityConfig[violation.severity].color}`}>
                      <SeverityIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{violation.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {violation.time}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
