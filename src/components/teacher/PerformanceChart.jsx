import { motion } from 'framer-motion';
import { TrendingUp, Award, CheckCircle, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { statsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function PerformanceChart() {
  const { darkMode } = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    average_score: 0,
    pass_rate: 0,
    completion_rate: 0,
    trends: {
      average_score: 0,
      pass_rate: 0,
      completion_rate: 0,
    }
  });
  const [animatedValues, setAnimatedValues] = useState({
    score: 0,
    pass: 0,
    completion: 0
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await statsAPI.getPerformance();
      setPerformanceData(response.data);
      
      // Start animation after data is loaded
      animateValues(response.data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const animateValues = (data) => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      score: data.average_score,
      pass: data.pass_rate,
      completion: data.completion_rate
    };

    let current = { score: 0, pass: 0, completion: 0 };
    const increments = {
      score: targets.score / steps,
      pass: targets.pass / steps,
      completion: targets.completion / steps
    };

    const timer = setInterval(() => {
      current.score += increments.score;
      current.pass += increments.pass;
      current.completion += increments.completion;

      if (current.score >= targets.score && current.pass >= targets.pass && current.completion >= targets.completion) {
        current = targets;
        clearInterval(timer);
      }

      setAnimatedValues({
        score: current.score.toFixed(1),
        pass: current.pass.toFixed(1),
        completion: current.completion.toFixed(1)
      });
    }, interval);
  };

  const getTrendDisplay = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  const metrics = [
    { 
      label: 'Average Score', 
      value: `${animatedValues.score}%`, 
      targetValue: performanceData.average_score, 
      animatedKey: 'score',
      icon: TrendingUp, 
      gradient: 'from-blue-500 to-cyan-500', 
      shadowColor: 'shadow-blue-500/50',
      trend: getTrendDisplay(performanceData.trends.average_score),
      darkColor: '#388bfd', 
      darkBg: 'rgba(56,139,253,0.08)', 
      darkBorder: 'rgba(56,139,253,0.2)',
    },
    { 
      label: 'Pass Rate', 
      value: `${animatedValues.pass}%`, 
      targetValue: performanceData.pass_rate, 
      animatedKey: 'pass',
      icon: CheckCircle, 
      gradient: 'from-green-500 to-emerald-500', 
      shadowColor: 'shadow-green-500/50',
      trend: getTrendDisplay(performanceData.trends.pass_rate),
      darkColor: '#3fb950', 
      darkBg: 'rgba(46,160,67,0.08)', 
      darkBorder: 'rgba(46,160,67,0.2)',
    },
    { 
      label: 'Completion Rate', 
      value: `${animatedValues.completion}%`, 
      targetValue: performanceData.completion_rate, 
      animatedKey: 'completion',
      icon: Award, 
      gradient: 'from-purple-500 to-pink-500', 
      shadowColor: 'shadow-purple-500/50',
      trend: getTrendDisplay(performanceData.trends.completion_rate),
      darkColor: '#a371f7', 
      darkBg: 'rgba(163,113,247,0.08)', 
      darkBorder: 'rgba(163,113,247,0.2)',
    },
  ];

  if (loading) {
    return (
      <div style={{
        backgroundColor: darkMode ? '#161b22' : '#fff',
        border: `1px solid ${darkMode ? '#30363d' : '#e5e7eb'}`,
        borderRadius: 12,
        padding: 48,
        textAlign: 'center',
        color: darkMode ? '#8b949e' : '#6b7280'
      }}>
        Loading performance data...
      </div>
    );
  }

  return (
    <div
      style={darkMode ? {
        backgroundColor: '#161b22', border: '1px solid #30363d',
        borderRadius: 12, padding: 24, position: 'relative', overflow: 'hidden',
      } : {}}
      className={darkMode ? '' : 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg perspective-1000'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: darkMode ? '#e6edf3' : '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
          Performance Insights
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
            <BarChart3 style={{ width: 18, height: 18, color: darkMode ? '#3fb950' : '#3b82f6' }} />
          </motion.span>
        </h3>
        <span style={darkMode ? {
          fontSize: 11, color: '#8b949e', padding: '4px 12px',
          borderRadius: 9999, backgroundColor: '#21262d', border: '1px solid #30363d',
        } : { fontSize: 12, color: '#6b7280', padding: '4px 12px', borderRadius: 9999, backgroundColor: '#f3f4f6' }}>
          Live Data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const displayValue = `${animatedValues[metric.animatedKey]}%`;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, z: 50, transition: { duration: 0.3 } }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <div
                style={darkMode ? {
                  position: 'relative', padding: 24, borderRadius: 12, overflow: 'hidden',
                  backgroundColor: hoveredCard === index ? '#1c2128' : '#0d1117',
                  border: `1px solid ${hoveredCard === index ? metric.darkBorder : '#21262d'}`,
                  transition: 'all 0.3s',
                  transform: hoveredCard === index ? 'translateZ(20px)' : 'translateZ(0px)',
                  transformStyle: 'preserve-3d',
                } : {}}
                className={darkMode ? '' : `relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200 transition-all duration-500 ${hoveredCard === index ? `shadow-2xl ${metric.shadowColor}` : 'shadow-lg'}`}
              >
                {/* Icon */}
                <motion.div
                  style={darkMode ? {
                    width: 52, height: 52, borderRadius: 12, marginBottom: 16,
                    backgroundColor: metric.darkBg, border: `1px solid ${metric.darkBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                  } : {}}
                  className={darkMode ? '' : `w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mx-auto mb-4 relative`}
                  animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                  transition={{ scale: { duration: 0.3 } }}
                >
                  <Icon style={{ width: 24, height: 24, color: darkMode ? metric.darkColor : 'white' }} className={darkMode ? '' : 'w-8 h-8 text-white relative z-10'} />
                </motion.div>

                {/* Value */}
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <motion.p
                    style={darkMode ? { fontSize: '1.75rem', fontWeight: 700, color: '#e6edf3' } : {}}
                    className={darkMode ? '' : 'text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'}
                    animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayValue}
                  </motion.p>
                </div>

                {/* Label */}
                <p style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#8b949e' : '#374151', textAlign: 'center', marginBottom: 10 }}>
                  {metric.label}
                </p>

                {/* Trend */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={darkMode ? {
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 500,
                    backgroundColor: 'rgba(46,160,67,0.1)', color: '#3fb950',
                    border: '1px solid rgba(46,160,67,0.3)',
                  } : {}} className={darkMode ? '' : 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'}>
                    ↑ {metric.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={darkMode
          ? { marginTop: 24, paddingTop: 24, borderTop: '1px solid #21262d' }
          : {}
        }
        className={darkMode ? '' : 'mt-8 pt-6 border-t border-gray-200'}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#8b949e' : '#374151', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          Detailed Breakdown <span>📈</span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: darkMode ? '#8b949e' : '#6b7280' }}>{metric.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#e6edf3' : '#111827' }}>{animatedValues[metric.animatedKey]}%</span>
              </div>
              <div style={{
                height: 8, borderRadius: 9999, overflow: 'hidden',
                backgroundColor: darkMode ? '#21262d' : '#e5e7eb',
              }}>
                <motion.div
                  style={darkMode ? {
                    height: '100%', borderRadius: 9999,
                    backgroundColor: metric.darkColor,
                  } : {}}
                  className={darkMode ? '' : `h-full bg-gradient-to-r ${metric.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedValues[metric.animatedKey]}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
