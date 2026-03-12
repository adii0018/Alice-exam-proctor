import { motion } from 'framer-motion';
import { Activity, Database, Wifi, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';

const SystemHealthMonitor = ({ health }) => {
  const services = [
    { key: 'websocket', label: 'WebSocket', icon: Wifi },
    { key: 'aiService', label: 'AI Service', icon: Activity },
    { key: 'database', label: 'Database', icon: Database },
    { key: 'storage', label: 'Storage', icon: HardDrive },
  ];

  const getStatusColor = (status) => {
    const colors = {
      connected: 'text-green-500',
      operational: 'text-green-500',
      healthy: 'text-green-500',
      optimal: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusIcon = (status) => {
    if (['connected', 'operational', 'healthy', 'optimal'].includes(status)) {
      return <CheckCircle className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        System Health
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          const status = health?.[service.key] || 'operational';
          return (
            <div
              key={service.key}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <Icon className={`w-4 h-4 ${getStatusColor(status)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {service.label}
                </p>
              </div>
              <div className={getStatusColor(status)}>
                {getStatusIcon(status)}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SystemHealthMonitor;
