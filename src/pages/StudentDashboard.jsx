import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLeaf } from 'react-icons/fa'
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

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [showCodeEntry, setShowCodeEntry] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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
        <div className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Alice
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Exam Proctor</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
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
