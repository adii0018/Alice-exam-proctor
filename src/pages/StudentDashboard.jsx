import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardSidebar from '../components/student/DashboardSidebar'
import DashboardNavbar from '../components/student/DashboardNavbar'
import MobileBottomNav from '../components/student/MobileBottomNav'
import WelcomeCard from '../components/student/WelcomeCard'
import UpcomingExams from '../components/student/UpcomingExams'
import QuickStats from '../components/student/QuickStats'
import RecentViolations from '../components/student/RecentViolations'
import JoinExamCard from '../components/student/JoinExamCard'
import PerformanceSummary from '../components/student/PerformanceSummary'
import QuizCodeEntry from '../components/student/QuizCodeEntry'
import QuizInterface from '../components/student/QuizInterface'
import { useTheme } from '../contexts/ThemeContext'

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
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#9333ea"/>
        </linearGradient>
      </defs>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="white" opacity="0.65"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
)

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const { darkMode } = useTheme()

  // Handle quiz start from code entry
  const handleQuizStart = (quiz) => {
    setActiveQuiz(quiz)
    setShowCodeEntry(false)
  }

  // Handle quiz exit
  const handleQuizExit = () => {
    setActiveQuiz(null)
  }

  // Handle join exam button click
  const handleJoinExam = () => {
    setShowCodeEntry(true)
  }

  // If quiz is active, show quiz interface
  if (activeQuiz) {
    return <QuizInterface quiz={activeQuiz} onExit={handleQuizExit} />
  }

  // If code entry is shown, show code entry screen
  if (showCodeEntry) {
    return <QuizCodeEntry onQuizStart={handleQuizStart} onBack={() => setShowCodeEntry(false)} />
  }

  return (
    <div
      className={darkMode ? '' : 'min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'}
      style={darkMode ? { minHeight: '100vh', backgroundColor: '#0d1117' } : {}}
    >
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
                  style={darkMode ? { color: '#e6edf3' } : { background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
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
                : { background: 'linear-gradient(135deg, #3b82f6, #9333ea)', color: 'white' }
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
              <WelcomeCard />
            </motion.div>

            {/* Join Exam Card - Prominent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <JoinExamCard onJoinExam={handleJoinExam} />
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
                  <UpcomingExams />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <PerformanceSummary />
                </motion.div>
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <QuickStats />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <RecentViolations />
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default StudentDashboard
