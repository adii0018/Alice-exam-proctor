import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardNavbar from './DashboardNavbar'
import MobileBottomNav from './MobileBottomNav'

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
            title={title} 
            sidebarCollapsed={sidebarCollapsed} 
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Alice Exam Proctor</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              S
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="pt-6 md:pt-24 px-4 md:px-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout
