import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, FileText, Presentation, GraduationCap, Activity, Server, Database, Cloud, Radio, ChevronRight } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1420,
    activeExams: 12,
    totalTeachers: 45,
    totalStudents: 1375,
  });

  const [health] = useState([
    { name: 'WebSocket', status: 'Operational', icon: Radio, ping: '12ms', color: '#3fb950' },
    { name: 'AI Service', status: 'Optimal', icon: Activity, ping: '45ms', color: '#3fb950' },
    { name: 'Database', status: 'Healthy', icon: Database, ping: '8ms', color: '#3fb950' },
    { name: 'Storage', status: '92% Free', icon: Cloud, ping: '—', color: '#e3b341' },
  ]);

  const [activities] = useState([
    { id: 1, title: 'Physics Final Exam started', author: 'Prof. Johnson', time: '9s ago', type: 'exam', color: '#8957e5' },
    { id: 2, title: 'High severity alert in Math', author: 'AI Proctor', time: '2m ago', type: 'alert', color: '#f85149' },
    { id: 3, title: 'New student registered', author: 'Sarah W.', time: '5m ago', type: 'user', color: '#2ea043' },
  ]);

  const [exams] = useState([
    { label: 'Live', count: 12, color: '#3fb950' },
    { label: 'Completed', count: 45, color: '#8b949e' },
    { label: 'Scheduled', count: 23, color: '#e3b341' },
    { label: 'Flagged', count: 5, color: '#f85149' },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        
        {/* Futuristic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-[#161b22] border border-[#30363d] p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ea043] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8957e5] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e6edf3] to-[#8b949e] tracking-tight">
                Command Center
              </h1>
              <p className="text-[#8b949e] mt-2 font-medium flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2ea043]"></span>
                </span>
                System is fully operational and monitoring in real-time.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] text-sm font-semibold rounded-lg border border-[#30363d] transition-all">
                Download Report
              </button>
              <button className="px-5 py-2.5 bg-[#2ea043] hover:bg-[#3fb950] text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(46,160,67,0.4)] transition-all">
                System Config
              </button>
            </div>
          </div>
        </motion.div>

        {/* Premium Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3fb950', glow: 'rgba(63,185,80,0.15)' },
            { title: 'Active Exams', value: stats.activeExams, icon: FileText, color: '#8957e5', glow: 'rgba(137,87,229,0.15)' },
            { title: 'Total Teachers', value: stats.totalTeachers, icon: Presentation, color: '#e3b341', glow: 'rgba(227,179,65,0.15)' },
            { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: '#3fb950', glow: 'rgba(63,185,80,0.15)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative group bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-gray-500"
              style={{ boxShadow: `0 0 20px ${stat.glow}` }}
            >
              <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-500" style={{ color: stat.color }}>
                <stat.icon size={100} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#8b949e] font-semibold text-sm tracking-wide uppercase">{stat.title}</span>
                  <div className="p-2 rounded-lg bg-[#161b22] border border-[#30363d]" style={{ color: stat.color }}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-[#e6edf3] tracking-tight">{stat.value.toLocaleString()}</h2>
                  <div className="h-1 w-full bg-[#21262d] rounded-full mt-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: '70%', backgroundColor: stat.color }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Exam Status Matrix */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-[#e6edf3] mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#8b949e]" />
              Exam Distribution Matrix
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {exams.map((exam, i) => (
                <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-center hover:border-gray-500 transition-colors">
                  <div className="text-3xl font-extrabold mb-1" style={{ color: exam.color }}>{exam.count}</div>
                  <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{exam.label}</div>
                </div>
              ))}
            </div>

            {/* Visual Bar */}
            <div className="w-full h-4 flex rounded-full overflow-hidden shadow-inner bg-[#21262d]">
              {exams.map((exam, i) => (
                <div 
                  key={i} 
                  style={{ width: `${(exam.count / 85) * 100}%`, backgroundColor: exam.color }}
                  className="h-full hover:opacity-80 transition-opacity cursor-pointer"
                  title={`${exam.label}: ${exam.count}`}
                ></div>
              ))}
            </div>
            
            {/* System Health Compact */}
            <div className="mt-8 grid grid-cols-2 gap-4">
               {health.map((h, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg border border-[#30363d]">
                   <div className="flex items-center gap-3">
                     <h.icon size={16} className="text-[#8b949e]" />
                     <span className="text-sm font-medium text-[#e6edf3]">{h.name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold" style={{ color: h.color }}>{h.status}</span>
                     {h.ping !== '—' && <span className="text-[10px] text-[#8b949e] bg-[#0d1117] px-2 py-1 rounded">{h.ping}</span>}
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Cyberpunk Activity Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ea043] opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-[#e6edf3] mb-6 flex items-center justify-between">
              Live Activity Stream
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#f85149] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f85149]"></span>
              </span>
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[9px] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#30363d] before:to-transparent">
              {activities.map((act) => (
                <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Timeline Node */}
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#0d1117] bg-[#0d1117] absolute left-0 md:left-1/2 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color }}></div>
                  </div>

                  {/* Content Card */}
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-gray-500 transition-colors ml-8 md:ml-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-[#e6edf3] leading-tight">{act.title}</h4>
                    </div>
                    <p className="text-xs text-[#8b949e] flex items-center justify-between mt-2">
                      <span>{act.author} • {act.time}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2ea043]"/>
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-[#161b22] hover:bg-[#30363d] text-[#e6edf3] text-xs font-bold uppercase tracking-widest rounded-lg border border-[#30363d] transition-colors">
              View All Logs
            </button>
          </motion.div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
