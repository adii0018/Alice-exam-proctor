import { Search, Bell, Moon, Sun, ChevronDown, X, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '../common/UserAvatar';
import { AVATAR_STYLES } from '../../utils/avatarGenerator';

export default function TeacherNavbar({ title, sidebarCollapsed, onSearch }) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) {}
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/auth'); };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  const gh = {
    navBg: darkMode ? 'rgba(13,17,23,0.9)' : 'rgba(255,255,255,0.85)',
    navBorder: darkMode ? '#21262d' : 'rgba(229,231,235,0.8)',
    titleColor: darkMode ? '#e6edf3' : '#111827',
    subColor: darkMode ? '#8b949e' : '#6b7280',
    iconColor: darkMode ? '#8b949e' : '#4b5563',
    hoverBg: darkMode ? '#21262d' : '#f3f4f6',
    inputBg: darkMode ? '#161b22' : '#f9fafb',
    inputBorder: darkMode ? '#30363d' : '#e5e7eb',
    inputText: darkMode ? '#e6edf3' : '#111827',
    inputPlaceholder: darkMode ? '#6e7681' : '#9ca3af',
    dropdownBg: darkMode ? '#161b22' : '#ffffff',
    dropdownBorder: darkMode ? '#30363d' : 'rgba(229,231,235,0.8)',
    itemHover: darkMode ? '#21262d' : '#f9fafb',
    itemText: darkMode ? '#e6edf3' : '#111827',
    divider: darkMode ? '#21262d' : '#f3f4f6',
    avatarBg: darkMode ? '#21262d' : undefined,
    avatarBorder: darkMode ? '#30363d' : undefined,
    avatarColor: darkMode ? '#3fb950' : 'white',
  }

  return (
    <header
      style={{
        position: 'fixed', top: 0, right: 0,
        left: sidebarCollapsed ? 80 : 280,
        height: 64,
        backgroundColor: gh.navBg,
        borderBottom: `1px solid ${gh.navBorder}`,
        backdropFilter: 'blur(16px)',
        zIndex: 30,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Title */}
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: gh.titleColor }}>{title}</h1>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <div className="hidden md:block" ref={searchRef} style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: gh.inputPlaceholder, pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search exams, students..."
              style={{
                paddingLeft: 32, paddingRight: searchQuery ? 32 : 12,
                paddingTop: 7, paddingBottom: 7,
                width: 240,
                backgroundColor: gh.inputBg,
                border: `1px solid ${gh.inputBorder}`,
                borderRadius: 8,
                fontSize: 13,
                color: gh.inputText,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = darkMode ? '#3fb950' : '#059669'; e.target.style.boxShadow = darkMode ? '0 0 0 3px rgba(46,160,67,0.1)' : '0 0 0 3px rgba(5,150,105,0.12)' }}
              onBlur={e => { e.target.style.borderColor = gh.inputBorder; e.target.style.boxShadow = 'none' }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: gh.inputPlaceholder,
                  padding: 2, borderRadius: 4,
                }}
              >
                <X style={{ width: 12, height: 12 }} />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/teacher/violations')}
            style={{
              position: 'relative', padding: 8, borderRadius: 8,
              background: 'none', border: 'none', cursor: 'pointer', color: gh.iconColor,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell style={{ width: 18, height: 18 }} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 7, height: 7, backgroundColor: '#f85149',
              borderRadius: '50%',
            }} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              padding: 8, borderRadius: 8,
              background: 'none', border: 'none', cursor: 'pointer', color: gh.iconColor,
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {darkMode ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
          </button>

          {/* Profile */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 10px', borderRadius: 8,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <UserAvatar
                user={user}
                size={32}
                showBorder={darkMode}
                borderColor={gh.avatarBorder}
                fallbackGradient={darkMode ? undefined : 'linear-gradient(135deg, #059669, #0d9488)'}
              />
              <span className="hidden lg:block" style={{ fontSize: 13, fontWeight: 500, color: gh.titleColor }}>
                {user?.username || 'Teacher'}
              </span>
              <ChevronDown style={{ width: 14, height: 14, color: gh.iconColor, transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: 200,
                    backgroundColor: gh.dropdownBg,
                    border: `1px solid ${gh.dropdownBorder}`,
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    zIndex: 50,
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${gh.divider}` }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: gh.itemText }}>{user?.username || 'Teacher'}</p>
                    <p style={{ fontSize: 11, color: gh.subColor, marginTop: 2 }}>{user?.email || 'teacher@example.com'}</p>
                  </div>
                  <div style={{ padding: 6 }}>
                    <button
                      onClick={() => { navigate('/teacher/settings'); setShowProfileMenu(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, color: gh.itemText, textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = gh.itemHover}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Settings style={{ width: 14, height: 14, color: gh.iconColor }} />
                      Settings
                    </button>
                    <div style={{ margin: '4px 0', borderTop: `1px solid ${gh.divider}` }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 8,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 13, color: '#f85149', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(248,81,73,0.08)' : '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut style={{ width: 14, height: 14 }} />
                      Logout
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
}
