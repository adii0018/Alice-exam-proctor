import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Plane, Leaf } from 'lucide-react'

// ── Star field background (same as FullPageLoader) ──────────────────────────
function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = window.innerWidth
    let H = window.innerHeight

    const COUNT = Math.floor((W * H) / 5000)
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      base: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }))
    const BRIGHT = Math.floor(COUNT * 0.06)
    for (let i = 0; i < BRIGHT; i++) {
      stars[i].r = Math.random() * 1.6 + 1.0
      stars[i].base = Math.random() * 0.4 + 0.4
    }

    let t = 0
    function resize() {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++
      for (const s of stars) {
        const alpha = Math.max(0, Math.min(1, s.base + Math.sin(t * s.speed + s.phase) * 0.18))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${alpha})`
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize, { passive: true })
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
import PremiumLandingPage from './pages/GithubLandingPage'
import AuthPage from './pages/AuthPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboardNew from './pages/TeacherDashboardNew'
import MyExams from './pages/student/MyExams'
import JoinExam from './pages/student/JoinExam'
import Violations from './pages/student/Violations'
import Profile from './pages/student/Profile'
import Settings from './pages/student/Settings'
import TeacherExams from './pages/teacher/Exams'
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
import BlogManagement from './pages/admin/BlogManagement'
import AvatarTest from './pages/AvatarTest'
import BlogPage from './pages/BlogPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import GdprPage from './pages/GdprPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import SyllabusHome from './pages/syllabus/SyllabusHome'
import SemesterSelect from './pages/syllabus/SemesterSelect'
import SubjectsList from './pages/syllabus/SubjectsList'
import SubjectDetail from './pages/syllabus/SubjectDetail'
import PYQHome from './pages/pyq/PYQHome'
import PYQSemester from './pages/pyq/PYQSemester'
import PYQPapers from './pages/pyq/PYQPapers'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import PrivacyAlert from './components/common/PrivacyAlert'
import { ExamErrorBoundary } from './components/error/ExamErrorBoundary'

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading for 1.5 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0d1117] flex flex-col items-center justify-center overflow-hidden font-sans">
        {/* Starfield Background */}
        <StarField />
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2ea043]/15 blur-[100px] rounded-full w-[250px] h-[250px] animate-pulse"></div>

          {/* Futuristic Spinner */}
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            {/* Outer Rings */}
            <div className="absolute inset-0 rounded-full border-t-[3px] border-[#3fb950] border-r-[3px] border-r-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 rounded-full border-b-[3px] border-[#2ea043] border-l-[3px] border-l-transparent animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-5 rounded-full border-dashed border-[2px] border-[#8b949e]/30 animate-spin" style={{ animationDuration: '8s' }}></div>

            {/* Flying Airplane Orbit */}
            <div className="absolute inset-2 animate-spin" style={{ animationDuration: '2s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#3fb950] drop-shadow-[0_0_10px_rgba(63,185,80,0.6)] rotate-[45deg]">
                <Plane size={24} className="fill-[#3fb950]/30" />
              </div>
            </div>

            {/* Center Leaf */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Leaf size={32} strokeWidth={2} className="text-[#3fb950] fill-[#3fb950]/20 animate-pulse drop-shadow-[0_0_15px_rgba(63,185,80,0.4)]" />
            </div>
          </div>

          {/* Brand Text */}
          <h2 className="text-3xl font-bold text-[#e6edf3] tracking-tight mb-2">
            Alice 🍃 <span className="text-[#3fb950]">Exam Proctor</span>
          </h2>

          {/* Loading Bar */}
          <div className="w-56 h-[3px] bg-[#21262d] rounded-full overflow-hidden mt-3 relative">
            <div className="absolute top-0 left-0 h-full bg-[#3fb950] rounded-full shadow-[0_0_10px_#3fb950]" style={{ transformOrigin: 'left', animation: 'scaleX 1.5s ease-out forwards' }}>
              <style>{`
                 @keyframes scaleX {
                   0% { transform: scaleX(0); }
                   100% { transform: scaleX(1); }
                 }
               `}</style>
            </div>
          </div>
          <p className="mt-4 text-[#8b949e] text-[11px] tracking-[0.2em] uppercase font-semibold animate-pulse">
            System Initializing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<PremiumLandingPage />} />
          <Route path="/syllabus" element={<SyllabusHome />} />
          <Route path="/syllabus/:year" element={<SemesterSelect />} />
          <Route path="/syllabus/:year/:semester" element={<SubjectsList />} />
          <Route path="/syllabus/:year/:semester/:subjectId" element={<SubjectDetail />} />
          <Route path="/pyq" element={<PYQHome />} />
          <Route path="/pyq/:year" element={<PYQSemester />} />
          <Route path="/pyq/:year/:semester" element={<PYQPapers />} />
          <Route path="/blog" element={<BlogPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/gdpr" element={<GdprPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
                  <JoinExam />
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
                  <ExamErrorBoundary>
                    <ExamPage />
                  </ExamErrorBoundary>
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
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute role="admin">
                  <BlogManagement />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <PrivacyAlert />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
