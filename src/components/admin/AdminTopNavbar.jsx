import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Moon, Menu, Settings, LogOut, Activity, ChevronDown,
  Users, FileText, BookOpen, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// ── Searchable data index ──────────────────────────────────────────────────
const SEARCH_INDEX = [
  // Users
  { id: 's1', label: 'Arjun Sharma',    sub: 'student · arjun@student.com',      icon: Users,    path: '/admin/users',      category: 'Users'    },
  { id: 's2', label: 'Priya Mehta',     sub: 'teacher · priya@teacher.com',      icon: Users,    path: '/admin/users',      category: 'Users'    },
  { id: 's3', label: 'Rahul Gupta',     sub: 'student · rahul@student.com',      icon: Users,    path: '/admin/users',      category: 'Users'    },
  { id: 's4', label: 'Vikram Singh',    sub: 'student · vikram@student.com',     icon: Users,    path: '/admin/users',      category: 'Users'    },
  { id: 's5', label: 'Anjali Verma',    sub: 'student · anjali@student.com',     icon: Users,    path: '/admin/users',      category: 'Users'    },
  { id: 's6', label: 'Super Admin',     sub: 'admin · admin@aliceproctor.com',   icon: Users,    path: '/admin/users',      category: 'Users'    },
  // Exams
  { id: 'e1', label: 'Physics Final Exam',       sub: 'PHY-2024-F · Live',        icon: FileText, path: '/admin/exams',      category: 'Exams'    },
  { id: 'e2', label: 'Mathematics Mid-Term',     sub: 'MTH-2024-M · Completed',   icon: FileText, path: '/admin/exams',      category: 'Exams'    },
  { id: 'e3', label: 'Chemistry Practical Test', sub: 'CHM-2024-P · Scheduled',   icon: FileText, path: '/admin/exams',      category: 'Exams'    },
  { id: 'e4', label: 'Biology Unit Test',        sub: 'BIO-2024-U · Live',        icon: FileText, path: '/admin/exams',      category: 'Exams'    },
  { id: 'e5', label: 'Computer Science Exam',    sub: 'CS-2024-E · Scheduled',    icon: FileText, path: '/admin/exams',      category: 'Exams'    },
  // Blogs
  { id: 'b1', label: 'Getting Started with Alice Proctor', sub: 'published · 1,250 views', icon: BookOpen, path: '/admin/blogs', category: 'Blogs' },
  { id: 'b2', label: 'Top 5 Anti-Cheat Mechanisms',        sub: 'draft',                   icon: BookOpen, path: '/admin/blogs', category: 'Blogs' },
  { id: 'b3', label: 'Future of Online Exams',             sub: 'published · 3,420 views', icon: BookOpen, path: '/admin/blogs', category: 'Blogs' },
  // Pages
  { id: 'p1', label: 'User Management',     sub: 'Manage all platform users',       icon: Users,    path: '/admin/users',     category: 'Pages'    },
  { id: 'p2', label: 'Exam Management',     sub: 'Monitor and control all exams',   icon: FileText, path: '/admin/exams',     category: 'Pages'    },
  { id: 'p3', label: 'Violations',          sub: 'View proctoring violations',      icon: Activity, path: '/admin/violations', category: 'Pages'    },
  { id: 'p4', label: 'Audit Logs',          sub: 'Admin action history',            icon: Settings, path: '/admin/audit',     category: 'Pages'    },
  { id: 'p5', label: 'System Settings',     sub: 'Configure platform settings',     icon: Settings, path: '/admin/settings',  category: 'Pages'    },
  { id: 'p6', label: 'Blog Management',     sub: 'Create and manage blog posts',    icon: BookOpen, path: '/admin/blogs',     category: 'Pages'    },
];

const CATEGORY_COLOR = {
  Users: '#3fb950',
  Exams: '#8957e5',
  Blogs: '#e3b341',
  Pages: '#58a6ff',
};

// sidebarOpen prop — AdminLayout passes this so the navbar shifts correctly
const AdminTopNavbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  // Admin panel is ALWAYS dark — force dark class on mount, restore on unmount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      const saved = localStorage.getItem('darkMode');
      if (saved === 'false') document.documentElement.classList.remove('dark');
    };
  }, []);

  const [searchQuery,       setSearchQuery]       = useState('');
  const [searchResults,     setSearchResults]     = useState([]);
  const [showSearch,        setShowSearch]        = useState(false);
  const [searchFocused,     setSearchFocused]     = useState(false);
  const [activeIndex,       setActiveIndex]       = useState(-1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile,       setShowProfile]       = useState(false);

  const searchRef  = useRef(null);
  const inputRef   = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  { setShowSearch(false); setSearchFocused(false); }
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search logic
  const runSearch = useCallback((q) => {
    if (!q.trim()) { setSearchResults([]); setShowSearch(false); return; }
    const lower = q.toLowerCase();
    const hits = SEARCH_INDEX.filter(
      item => item.label.toLowerCase().includes(lower) || item.sub.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower)
    ).slice(0, 8);
    setSearchResults(hits);
    setShowSearch(true);
    setActiveIndex(-1);
  }, []);

  useEffect(() => { runSearch(searchQuery); }, [searchQuery, runSearch]);

  const handleSearchKeyDown = (e) => {
    if (!showSearch || searchResults.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, searchResults.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    if (e.key === 'Enter' && activeIndex >= 0) { navigateResult(searchResults[activeIndex]); }
    if (e.key === 'Escape') { setShowSearch(false); setSearchQuery(''); inputRef.current?.blur(); }
  };

  const navigateResult = (item) => {
    navigate(item.path);
    setSearchQuery('');
    setShowSearch(false);
    setSearchFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => { setSearchQuery(''); setShowSearch(false); inputRef.current?.focus(); };

  const notifications = [
    { id: 1, type: 'violation', message: 'High severity violation detected in Physics Exam', time: '2m ago', dot: '#f85149' },
    { id: 2, type: 'exam',      message: 'New exam started by Prof. Johnson',               time: '5m ago', dot: '#8957e5' },
    { id: 3, type: 'system',    message: 'System backup completed successfully',             time: '1h ago', dot: '#3fb950' },
  ];

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/auth');
  };

  const handleSettingsNav = () => {
    setShowProfile(false);
    navigate('/admin/settings');
  };

  // Navbar left offset synced with sidebar state
  const leftClass = sidebarOpen ? 'lg:left-64' : 'lg:left-20';

  // Group results by category
  const grouped = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <header
      className={`fixed top-0 right-0 left-0 ${leftClass} h-16 bg-[#0d1117]/90 backdrop-blur-xl border-b border-[#30363d] z-20 transition-all duration-300`}
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        {/* ── Left ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-[#161b22] transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5 text-[#8b949e]" />
          </button>

          {/* ── Global Search ──────────────────────────────────────────── */}
          <div className="relative hidden md:block w-72 lg:w-96" ref={searchRef}>
            {/* Input */}
            <div className={`relative transition-all duration-200 ${
              searchFocused ? 'ring-1 ring-[#2ea043] rounded-xl' : ''
            }`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search users, exams, pages…  (↑↓ to navigate)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { setSearchFocused(true); if (searchQuery) setShowSearch(true); }}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-8 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-[#e6edf3] placeholder-[#6e7681] focus:outline-none transition-all"
              />
              {/* Clear button */}
              {searchQuery && (
                <button onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#30363d] transition-colors">
                  <X className="w-3.5 h-3.5 text-[#8b949e]" />
                </button>
              )}
            </div>

            {/* ── Results Dropdown ─────────────────────────────────────── */}
            <AnimatePresence>
              {showSearch && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Flat list with category labels */}
                  <div className="max-h-80 overflow-y-auto py-2">
                    {(() => {
                      let globalIdx = -1;
                      return Object.entries(grouped).map(([cat, items]) => (
                        <div key={cat}>
                          {/* Category header */}
                          <div className="px-3 py-1.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: CATEGORY_COLOR[cat] }}>{cat}</span>
                            <div className="flex-1 h-px" style={{ backgroundColor: CATEGORY_COLOR[cat] + '30' }} />
                          </div>
                          {items.map(item => {
                            globalIdx++;
                            const idx = globalIdx;
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => navigateResult(item)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                                  activeIndex === idx ? 'bg-[#0d1117]' : 'hover:bg-[#0d1117]'
                                }`}
                              >
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: CATEGORY_COLOR[cat] + '18', border: `1px solid ${CATEGORY_COLOR[cat]}30` }}>
                                  <Icon size={13} style={{ color: CATEGORY_COLOR[cat] }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-[#e6edf3] font-medium truncate leading-none">
                                    {/* Highlight matching text */}
                                    {item.label.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                                      part.toLowerCase() === searchQuery.toLowerCase()
                                        ? <mark key={i} className="bg-[#2ea043]/30 text-[#3fb950] rounded px-0.5" style={{ background: 'none', color: '#3fb950' }}>{part}</mark>
                                        : part
                                    )}
                                  </p>
                                  <p className="text-[11px] text-[#8b949e] mt-0.5 truncate">{item.sub}</p>
                                </div>
                                {activeIndex === idx && (
                                  <span className="text-[10px] text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded flex-shrink-0">↵</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2 border-t border-[#30363d] flex items-center gap-3 text-[10px] text-[#6e7681]">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                    <span>Esc close</span>
                    <span className="ml-auto">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                  </div>
                </motion.div>
              )}

              {/* No results */}
              {showSearch && searchQuery && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 px-4 py-6 text-center"
                >
                  <Search className="w-6 h-6 text-[#8b949e] mx-auto mb-2" />
                  <p className="text-sm text-[#8b949e]">No results for <span className="text-[#e6edf3] font-medium">"{searchQuery}"</span></p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* System Status badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#2ea043]/10 rounded-lg border border-[#2ea043]/20">
            <Activity className="w-3.5 h-3.5 text-[#3fb950]" />
            <span className="text-xs font-semibold text-[#3fb950]">Operational</span>
          </div>

          {/* ── Dark Mode Badge — admin is always dark ────────────────── */}
          <div
            title="Admin panel is always in dark mode"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] cursor-default select-none"
          >
            <Moon className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="text-[11px] font-semibold text-[#58a6ff] tracking-wide">Dark</span>
          </div>

          {/* ── Notifications ─────────────────────────────────────────── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-[#161b22] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#8b949e]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f85149] rounded-full animate-pulse" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#161b22] rounded-xl shadow-2xl border border-[#30363d] overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
                    <h3 className="font-semibold text-[#e6edf3] text-sm">Notifications</h3>
                    <span className="text-xs text-[#8b949e]">{notifications.length} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id}
                        className="px-4 py-3 hover:bg-[#0d1117] transition-colors border-b border-[#30363d] last:border-0 flex items-start gap-3 cursor-pointer">
                        <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.dot }} />
                        <div>
                          <p className="text-sm text-[#e6edf3] leading-snug">{n.message}</p>
                          <p className="text-xs text-[#8b949e] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setShowNotifications(false); navigate('/admin/audit'); }}
                    className="w-full py-2.5 text-xs text-[#3fb950] hover:bg-[#0d1117] transition-colors font-semibold border-t border-[#30363d]"
                  >
                    View all in Audit Logs →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Admin Profile ─────────────────────────────────────────── */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#161b22] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2ea043] to-[#8957e5] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-[#e6edf3] leading-none">
                  {user?.name || user?.username || 'Admin'}
                </p>
                <p className="text-[10px] text-[#8b949e] mt-0.5">Super Admin</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8b949e] transition-transform hidden md:block ${showProfile ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#161b22] rounded-xl shadow-2xl border border-[#30363d] overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[#30363d]">
                    <p className="font-semibold text-[#e6edf3] text-sm">{user?.name || 'Super Admin'}</p>
                    <p className="text-xs text-[#8b949e] mt-0.5">{user?.email || 'admin@aliceproctor.com'}</p>
                    <span className="inline-flex mt-1.5 px-2 py-0.5 bg-red-500/15 border border-red-500/30 rounded-full text-[10px] font-bold text-red-400">
                      ADMIN
                    </span>
                  </div>

                  <div className="p-2">
                    {/* Settings */}
                    <button
                      onClick={handleSettingsNav}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0d1117] transition-colors text-left group"
                    >
                      <Settings className="w-4 h-4 text-[#8b949e] group-hover:text-[#e6edf3] transition-colors" />
                      <span className="text-sm text-[#8b949e] group-hover:text-[#e6edf3] transition-colors">System Settings</span>
                    </button>

                    {/* Logout ✅ connected to real logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-left group mt-1"
                    >
                      <LogOut className="w-4 h-4 text-[#f85149]" />
                      <span className="text-sm text-[#f85149] font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminTopNavbar;
