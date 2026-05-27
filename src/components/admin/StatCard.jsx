import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, change, trend, icon, color, subtitle, pulse }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-[#3fb950]';
    if (trend === 'down') return 'text-[#f85149]';
    return 'text-[#8b949e]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative bg-[#161b22] rounded-2xl p-6 shadow-sm hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all border border-[#30363d] overflow-hidden group"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
      
      {/* Icon */}
      <div className="relative flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl shadow-lg ${pulse ? 'animate-pulse' : ''}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-sm font-medium text-[#8b949e] mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-[#e6edf3]">
          {(value || 0).toLocaleString()}
        </p>
        {subtitle && (
          <p className="text-xs text-[#8b949e] mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Pulse Effect for Live Stats */}
      {pulse && (
        <div className="absolute bottom-4 right-4">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
