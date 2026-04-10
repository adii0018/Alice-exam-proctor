import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardSidebar from '../components/student/DashboardSidebar'
import DashboardNavbar from '../components/student/DashboardNavbar'
import MobileBottomNav from '../components/student/MobileBottomNav'
import WelcomeCard from '../components/student/WelcomeCard'
import UpcomingExams from '../components/student/UpcomingExams'
import QuickStats from '../components/student/QuickStats'
import RecentViolations from '../components/student/RecentViolations'
import PerformanceSummary from '../components/student/PerformanceSummary'
import { useTheme } from '../contexts/ThemeContext'
import AliceAIChat from '../components/ai/AliceAIChat'
import { studentAPI } from '../utils/api'
import LightweightBackground from '../components/common/LightweightBackground'

// Alice logo — same as landing page
const AliceLogo = ({ size = 36, dark }) => (
  dark ? (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="url(#lgDash)"/>
      <defs>
        <linearGradient id="lgDash" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
      </defs>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.65"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
)

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAliceChat, setShowAliceChat] = useState(false)
  const { darkMode } = useTheme()

  const [dashboard, setDashboard] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setDashboardLoading(true)
      setDashboardError(null)
      try {
        const res = await studentAPI.dashboard()
        if (cancelled) return
        setDashboard(res.data || null)
      } catch (e) {
        if (cancelled) return
        setDashboardError(e)
      } finally {
        if (cancelled) return
        setDashboardLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div
      style={darkMode ? { minHeight: '100vh', backgroundColor: '#0d1117', position: 'relative' } : { minHeight: '100vh', backgroundColor: '#f6f8fa', position: 'relative' }}
    >
      {!darkMode && <LightweightBackground />}
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar 
          isCollapsed={sidebarCollapsed} 
          setIsCollapsed={setSidebarCollapsed} 
        />
      </div>

      {/* Main Content */}
      <div
        className="md:ml-[280px] transition-all duration-300"
        style={{ 
          marginLeft: window.innerWidth >= 768 ? (sidebarCollapsed ? '80px' : '280px') : '0'
        }}
      >
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <DashboardNavbar 
            title="Dashboard" 
            sidebarCollapsed={sidebarCollapsed} 
          />
        </div>

        {/* Mobile Header */}
        <div
          className="md:hidden sticky top-0 z-30 backdrop-blur-xl px-4 py-4"
          style={darkMode
            ? { backgroundColor: 'rgba(13,17,23,0.85)', borderBottom: '1px solid #21262d' }
            : { backgroundColor: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(229,231,235,0.5)' }
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AliceLogo size={40} dark={darkMode} />
              <div>
                <h1
                  className="text-lg font-bold"
                  style={darkMode ? { color: '#e6edf3' } : { background: 'linear-gradient(to right, #059669, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Alice
                </h1>
                <p style={{ fontSize: '11px', color: darkMode ? '#8b949e' : '#6b7280' }}>Exam Proctor</p>
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={darkMode
                ? { backgroundColor: '#21262d', border: '1px solid #30363d', color: '#3fb950' }
                : { background: 'linear-gradient(135deg, #059669, #0d9488)', color: 'white' }
              }
            >
              S
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="pt-6 md:pt-24 px-4 md:px-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {dashboardLoading && !dashboard && (
                <p style={{ color: darkMode ? '#8b949e' : '#6b7280', marginBottom: 12 }}>
                  Loading your dashboard...
                </p>
              )}
              {dashboardError && (
                <p style={{ color: '#f85149', marginBottom: 12 }}>
                  Failed to load dashboard data.
                </p>
              )}
              <WelcomeCard stats={dashboard?.stats || null} />
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <UpcomingExams exams={dashboard?.available_exams || []} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <PerformanceSummary
                    dashboardStats={dashboard?.stats || null}
                    activityScores={dashboard?.stats?.activity_scores_last_7_days || []}
                  />
                </motion.div>
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <QuickStats stats={dashboard?.stats || null} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <RecentViolations violations={dashboard?.recent_alerts || []} />
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Alice AI Chat */}
      {showAliceChat && <AliceAIChat onClose={() => setShowAliceChat(false)} />}
      <button
        onClick={() => setShowAliceChat(prev => !prev)}
        className="fixed bottom-20 right-6 md:bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50"
        style={{ background: 'linear-gradient(135deg, #2ea043, #1a7f37)', boxShadow: '0 0 0 3px rgba(46,160,67,0.25), 0 8px 24px rgba(0,0,0,0.4)' }}
        title="Chat with Alice AI"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="2" x2="12" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="12" cy="1.5" r="1.2" fill="white"/>
          <rect x="4" y="5" width="16" height="11" rx="3" fill="white" fillOpacity="0.95"/>
          <circle cx="9" cy="10" r="1.8" fill="#2ea043"/>
          <circle cx="15" cy="10" r="1.8" fill="#2ea043"/>
          <circle cx="9.6" cy="9.4" r="0.6" fill="white"/>
          <circle cx="15.6" cy="9.4" r="0.6" fill="white"/>
          <rect x="8.5" y="13" width="7" height="1.5" rx="0.75" fill="#2ea043" fillOpacity="0.7"/>
          <rect x="7" y="17" width="10" height="5" rx="2" fill="white" fillOpacity="0.85"/>
          <rect x="2" y="17.5" width="4" height="2.5" rx="1.25" fill="white" fillOpacity="0.7"/>
          <rect x="18" y="17.5" width="4" height="2.5" rx="1.25" fill="white" fillOpacity="0.7"/>
          <circle cx="12" cy="19.5" r="1" fill="#2ea043" fillOpacity="0.6"/>
        </svg>
      </button>
    </div>
  )
}

export default StudentDashboard
