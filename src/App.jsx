import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PremiumLandingPage from './pages/GithubLandingPage'
import AuthPage from './pages/AuthPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboardNew from './pages/TeacherDashboardNew'
import MyExams from './pages/student/MyExams'
import Violations from './pages/student/Violations'
import Profile from './pages/student/Profile'
import Settings from './pages/student/Settings'
import TeacherExams from './pages/teacher/Exams'
import TeacherStudents from './pages/teacher/Students'
import TeacherLiveMonitoring from './pages/teacher/LiveMonitoring'
import TeacherResults from './pages/teacher/Results'
import TeacherViolations from './pages/teacher/Violations'
import TeacherSettings from './pages/teacher/Settings'
import TeacherProfile from './pages/teacher/Profile'
import ExamPage from './pages/student/ExamPage'
import ExamResultPage from './pages/student/ExamResultPage'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import ExamsManagement from './pages/admin/ExamsManagement'
import ViolationsManagement from './pages/admin/ViolationsManagement'
import AuditLogs from './pages/admin/AuditLogs'
import SystemSettings from './pages/admin/SystemSettings'
import AvatarTest from './pages/AvatarTest'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<PremiumLandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/avatar-test" element={<AvatarTest />} />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/exams" 
            element={
              <ProtectedRoute role="student">
                <MyExams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/join" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/violations" 
            element={
              <ProtectedRoute role="student">
                <Violations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/settings" 
            element={
              <ProtectedRoute role="student">
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/exam/:examId" 
            element={
              <ProtectedRoute role="student">
                <ExamPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/exam/:examId/result" 
            element={
              <ProtectedRoute role="student">
                <ExamResultPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboardNew />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/exams" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherExams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/students" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/live" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherLiveMonitoring />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/results" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherResults />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/violations" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherViolations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/settings" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Super Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute role="admin">
                <UsersManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/exams" 
            element={
              <ProtectedRoute role="admin">
                <ExamsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/violations" 
            element={
              <ProtectedRoute role="admin">
                <ViolationsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/audit" 
            element={
              <ProtectedRoute role="admin">
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute role="admin">
                <SystemSettings />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
