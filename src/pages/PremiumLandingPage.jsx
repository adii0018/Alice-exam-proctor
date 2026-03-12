import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaLeaf, FaShieldAlt, FaBell, FaChartLine, FaLock, FaBrain, FaArrowRight, FaCheck, FaPlay, FaVideo, FaUsers, FaMoon, FaSun, FaClipboardList, FaEye, FaTrophy } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'
import { Mail, BookOpen, FileText, HelpCircle } from 'lucide-react'
import PremiumFooterEnhanced from '../components/common/PremiumFooterEnhanced'

const PremiumLandingPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: '', message: '' })

    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message
        })
        setContactForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-black' 
        : 'bg-[#F8FAFC]'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-950 via-blue-900 to-purple-900' 
            : 'bg-gradient-to-135 from-[#EEF2FF] via-[#F5F3FF] to-[#ECFEFF]'
        }`} />
        <motion.div
          className={`absolute top-0 -left-40 w-80 h-80 rounded-full filter blur-3xl ${
            darkMode ? 'bg-blue-500/20' : 'bg-indigo-400/10'
          }`}
          style={{ mixBlendMode: darkMode ? 'screen' : 'normal', opacity: darkMode ? 1 : 0.4 }}
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-0 -right-40 w-80 h-80 rounded-full filter blur-3xl ${
            darkMode ? 'bg-purple-500/20' : 'bg-violet-400/10'
          }`}
          style={{ mixBlendMode: darkMode ? 'screen' : 'normal', opacity: darkMode ? 1 : 0.4 }}
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-40 left-20 w-80 h-80 rounded-full filter blur-3xl ${
            darkMode ? 'bg-pink-500/20' : 'bg-cyan-400/10'
          }`}
          style={{ mixBlendMode: darkMode ? 'screen' : 'normal', opacity: darkMode ? 1 : 0.4 }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Enhanced Navigation Header */}
      <motion.nav 
        className={`sticky top-0 z-50 backdrop-blur-2xl border-b transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-900/90 border-slate-700/50 shadow-lg shadow-blue-500/5' 
            : 'bg-white/80 border-gray-200/50 shadow-lg shadow-indigo-500/5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Navigation */}
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            {/* Enhanced Logo Section */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer ${
                darkMode 
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600' 
                  : 'bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7]'
              }`}>
                <FaLeaf className="text-white text-2xl group-hover:rotate-12 transition-transform duration-300" />
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode ? 'bg-white/10' : 'bg-white/20'
                }`} />
                {/* Pulse Ring */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl border-2 ${
                    darkMode ? 'border-blue-400/50' : 'border-indigo-500/50'
                  }`}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
                    darkMode 
                      ? 'from-blue-400 via-purple-400 to-pink-400' 
                      : 'from-[#6366F1] via-[#8B5CF6] to-[#A855F7]'
                  }`}>
                    Alice
                  </span>
                  {/* Verified Badge */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      darkMode 
                        ? 'bg-blue-500/20 border border-blue-400' 
                        : 'bg-blue-100 border border-blue-500'
                    }`}
                  >
                    <FaCheck className={`text-xs ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </motion.div>
                </div>
                <div className={`text-xs font-semibold tracking-wider ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  EXAM PROCTOR
                </div>
              </div>
            </motion.div>

            {/* Enhanced Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { href: '#features', label: 'Features', icon: <FaShieldAlt />, badge: 'New' },
                { href: '#how-it-works', label: 'How it Works', icon: <FaBrain />, badge: null },
                { href: '#pricing', label: 'Pricing', icon: <FaTrophy />, badge: 'Hot' },
                { href: '#privacy', label: 'Privacy', icon: <FaLock />, badge: null }
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-slate-800/80' 
                      : 'text-gray-700 hover:text-[#6366F1] hover:bg-gray-100/80'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`text-base ${
                    darkMode ? 'text-blue-400' : 'text-[#6366F1]'
                  }`}>{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        link.badge === 'New' 
                          ? darkMode 
                            ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                            : 'bg-green-100 text-green-600 border border-green-300'
                          : darkMode 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-400/50' 
                            : 'bg-orange-100 text-orange-600 border border-orange-300'
                      }`}
                    >
                      {link.badge}
                    </motion.span>
                  )}
                </motion.a>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-700 text-yellow-400 hover:from-slate-700 hover:to-slate-600 shadow-lg' 
                    : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-white border border-gray-200 shadow-md'
                }`}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 0 : 180, scale: darkMode ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <FaSun className="text-xl" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0, scale: darkMode ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <FaMoon className="text-xl" />
                </motion.div>
              </motion.button>

              {/* Login Button */}
              <Link to="/auth">
                <motion.button
                  className={`hidden sm:block px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    darkMode 
                      ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>

              {/* Get Started Button */}
              <Link to="/auth">
                <motion.button
                  className={`relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden group ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-blue-500/30'
                      : 'bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7] text-white shadow-lg shadow-indigo-500/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <motion.div
                    className={`absolute inset-0 ${
                      darkMode ? 'bg-white/20' : 'bg-white/30'
                    }`}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className={`absolute bottom-0 left-0 right-0 h-px ${
          darkMode 
            ? 'bg-gradient-to-r from-transparent via-blue-500/50 to-transparent' 
            : 'bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent'
        }`} />
      </motion.nav>


      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-blue-900/50 border border-blue-700' 
                  : 'bg-white/80 border border-[rgba(15,23,42,0.06)] backdrop-blur-sm'
              }`}
            >
              <span className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse" />
              <span className={`text-sm font-semibold transition-colors duration-300 ${
                darkMode ? 'text-blue-400' : 'text-[#6366F1]'
              }`}>Powered by Advanced AI</span>
            </motion.div>

            {/* Main Headline */}
            <div className="relative mb-8">
              {/* Glow effect behind text */}
              <div className="absolute inset-0 blur-3xl opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
              </div>
              
              <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`block mb-3 transition-colors duration-300 ${
                    darkMode ? 'text-white drop-shadow-lg' : 'text-[#020617]'
                  }`}
                >
                  AI-Powered
                </motion.span>
                
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`block mb-3 font-extrabold ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent'
                  }`}
                  style={{
                    backgroundSize: '200% auto',
                  }}
                >
                  Online Exam
                </motion.span>
                
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className={`block transition-colors duration-300 ${
                    darkMode ? 'text-white drop-shadow-lg' : 'text-[#020617]'
                  }`}
                >
                  Proctoring
                </motion.span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-[#334155]'
            }`}>
              Fair exams. Smart monitoring. Real-time AI supervision.
              <br className="hidden md:block" />
              The future of online examination is here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                to="/auth"
                className={`group px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-3 ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
                    : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-2xl hover:shadow-indigo-500/30'
                }`}
              >
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                darkMode
                  ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  : 'bg-white/80 text-[#334155] border-[rgba(15,23,42,0.06)] hover:border-[#6366F1] hover:bg-white backdrop-blur-sm'
              }`}>
                <FaPlay className={darkMode ? 'text-blue-600' : 'text-[#6366F1]'} />
                Watch Demo
              </button>
            </div>

            {/* Hero Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative mt-16"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl`} />
              
              {/* Main Image Container */}
              <div className={`relative backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${
                darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-gray-200'
              }`}>
                {/* Image with Overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop&q=80"
                    alt="Students taking online exam with AI proctoring"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 ${
                    darkMode 
                      ? 'bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent' 
                      : 'bg-gradient-to-t from-white via-white/50 to-transparent'
                  }`} />
                  
                  {/* Floating Stats Cards on Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className={`absolute top-6 left-6 backdrop-blur-xl rounded-2xl p-4 border shadow-xl ${
                      darkMode 
                        ? 'bg-slate-900/90 border-slate-700' 
                        : 'bg-white/90 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <FaShieldAlt className="text-white text-xl" />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>99.9%</div>
                        <div className={`text-xs font-medium ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Detection Rate</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className={`absolute top-6 right-6 backdrop-blur-xl rounded-2xl p-4 border shadow-xl ${
                      darkMode 
                        ? 'bg-slate-900/90 border-slate-700' 
                        : 'bg-white/90 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className={`text-xs font-semibold ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`}>Live Monitoring</span>
                    </div>
                    <div className={`text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>342 Students</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className={`absolute bottom-6 left-6 right-6 backdrop-blur-xl rounded-2xl p-4 border shadow-xl ${
                      darkMode 
                        ? 'bg-slate-900/90 border-slate-700' 
                        : 'bg-white/90 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FaBrain className="text-white text-lg" />
                        </div>
                        <div>
                          <div className={`font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>AI Proctoring Active</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>Face detection • Audio monitoring • Screen tracking</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-green-500/20' : 'bg-green-100'
                        }`}>
                          <FaCheck className={darkMode ? 'text-green-400' : 'text-green-600'} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Dashboard Preview */}
                <div className={`rounded-2xl p-8 overflow-hidden ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900' 
                    : 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50'
                }`}>
                  {/* Mini Dashboard Header */}
                  <div className={`flex items-center justify-between mb-6 pb-4 border-b ${
                    darkMode ? 'border-white/10' : 'border-gray-300/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FaLeaf className="text-white text-xl" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-lg ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Alice Dashboard</h4>
                        <p className={`text-sm ${
                          darkMode ? 'text-blue-200' : 'text-blue-600'
                        }`}>Live Monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">Live</span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`backdrop-blur-sm rounded-xl p-5 border hover:scale-105 transition-all ${
                        darkMode 
                          ? 'bg-white/10 border-white/10 hover:bg-white/15' 
                          : 'bg-white/60 border-gray-200 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                        }`}>
                          <FaVideo className={`text-xl ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>24</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-blue-200' : 'text-blue-600'
                          }`}>Active Exams</div>
                        </div>
                      </div>
                      <div className={`h-1 rounded-full overflow-hidden ${
                        darkMode ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`backdrop-blur-sm rounded-xl p-5 border hover:scale-105 transition-all ${
                        darkMode 
                          ? 'bg-white/10 border-white/10 hover:bg-white/15' 
                          : 'bg-white/60 border-gray-200 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                        }`}>
                          <FaUsers className={`text-xl ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>342</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-purple-200' : 'text-purple-600'
                          }`}>Students Online</div>
                        </div>
                      </div>
                      <div className={`h-1 rounded-full overflow-hidden ${
                        darkMode ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                          initial={{ width: 0 }}
                          animate={{ width: '90%' }}
                          transition={{ delay: 0.9, duration: 1 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className={`backdrop-blur-sm rounded-xl p-5 border hover:scale-105 transition-all ${
                        darkMode 
                          ? 'bg-white/10 border-white/10 hover:bg-white/15' 
                          : 'bg-white/60 border-gray-200 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-pink-500/20' : 'bg-pink-100'
                        }`}>
                          <FaChartLine className={`text-xl ${
                            darkMode ? 'text-pink-400' : 'text-pink-600'
                          }`} />
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>98%</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-pink-200' : 'text-pink-600'
                          }`}>Success Rate</div>
                        </div>
                      </div>
                      <div className={`h-1 rounded-full overflow-hidden ${
                        darkMode ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                          initial={{ width: 0 }}
                          animate={{ width: '98%' }}
                          transition={{ delay: 1, duration: 1 }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Activity Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                      darkMode 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/40 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <FaBell className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                        <h5 className={`font-semibold text-sm ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Recent Activity</h5>
                      </div>
                      <div className="space-y-2">
                        {[
                          { text: 'Exam started: Mathematics 101', color: 'bg-green-400' },
                          { text: 'Alert: Tab switch detected', color: 'bg-yellow-400' },
                          { text: 'Student completed exam', color: 'bg-blue-400' }
                        ].map((activity, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + i * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${activity.color}`} />
                            <p className={`text-xs leading-relaxed ${
                              darkMode ? 'text-blue-100/80' : 'text-gray-700'
                            }`}>{activity.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                      darkMode 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-white/40 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <FaShieldAlt className={darkMode ? 'text-green-400' : 'text-green-600'} />
                        <h5 className={`font-semibold text-sm ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>AI Protection</h5>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Face Detection', value: 100 },
                          { label: 'Audio Monitor', value: 100 },
                          { label: 'Screen Track', value: 95 }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs ${
                                darkMode ? 'text-blue-100/70' : 'text-gray-600'
                              }`}>{item.label}</span>
                              <span className={`text-xs font-semibold ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`}>{item.value}%</span>
                            </div>
                            <div className={`h-1 rounded-full overflow-hidden ${
                              darkMode ? 'bg-white/10' : 'bg-gray-200'
                            }`}>
                              <motion.div
                                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ delay: 1.3 + i * 0.1, duration: 0.8 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Stats & Impact Section */}
      <section className={`py-16 transition-colors duration-300 ${
        darkMode ? 'bg-slate-800/50' : 'bg-white/40'
      }`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className={`text-sm font-semibold uppercase tracking-wider mb-4 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-[#64748B]'
            }`}>
              Empowering Education with AI
            </p>
            <h3 className={`text-2xl md:text-3xl font-bold mb-12 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-[#020617]'
            }`}>
              Making Online Exams Fair & Secure
            </h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { number: '10K+', label: 'Exams Conducted', icon: <FaClipboardList /> },
                { number: '50K+', label: 'Students Protected', icon: <FaUsers /> },
                { number: '99.9%', label: 'Uptime Guarantee', icon: <FaShieldAlt /> },
                { number: '24/7', label: 'AI Monitoring', icon: <FaEye /> }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white/65 hover:bg-white/80 backdrop-blur-sm border border-[rgba(15,23,42,0.06)]'
                  }`}
                >
                  <div className={`text-4xl mb-3 transition-colors duration-300 ${
                    darkMode ? 'text-blue-400' : 'text-[#6366F1]'
                  }`}>{stat.icon}</div>
                  <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode ? 'from-blue-600 to-purple-600' : 'from-[#6366F1] to-[#8B5CF6]'
                  }`}>
                    {stat.number}
                  </div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-[#64748B]'
                  }`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/30' : 'bg-transparent'
      }`}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-[#020617]'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-[#334155]'
            }`}>
              Everything you need for secure, fair, and efficient online examinations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`relative py-32 px-6 overflow-hidden transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-blue-900 to-purple-900' 
          : 'bg-white/40'
      }`}>
        {/* Animated Background Blobs */}
        <motion.div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 ${
            darkMode ? 'bg-blue-500' : 'bg-blue-400'
          }`}
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 ${
            darkMode ? 'bg-purple-500' : 'bg-purple-400'
          }`}
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-blue-500/20 border border-blue-400/30' 
                  : 'bg-white/80 border border-[rgba(15,23,42,0.06)] backdrop-blur-sm'
              }`}
            >
              <span className="w-2 h-2 bg-[#6366F1] rounded-full animate-pulse" />
              <span className={`text-sm font-semibold transition-colors duration-300 ${
                darkMode ? 'text-blue-300' : 'text-[#6366F1]'
              }`}>Simple & Effective</span>
            </motion.div>

            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-[#020617]'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-blue-200' : 'text-[#334155]'
            }`}>
              Three simple steps to conduct fair online exams with AI-powered monitoring
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} darkMode={darkMode} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link
              to="/auth"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                darkMode
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/50'
              }`}
            >
              Start Your First Exam
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* AI Assistant Highlight */}
      <section className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/30' : 'bg-transparent'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-6 px-4 py-2 bg-purple-100 rounded-full">
                <span className={`text-sm font-semibold ${
                  darkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  AI Assistant
                </span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Meet Alice
              </h2>
              <p className={`text-xl mb-8 leading-relaxed transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your intelligent AI exam assistant. Get instant help, real-time support, and smart insights during examinations.
              </p>
              <ul className="space-y-4 mb-8">
                {['Natural language conversations', 'Instant exam support', 'Smart violation detection', 'Real-time analytics'].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <motion.button
                    className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-200 flex items-center gap-3 ${
                      darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
                        : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-2xl hover:shadow-indigo-500/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaBrain className="text-xl" />
                    Try Alice Now
                  </motion.button>
                </Link>
                
                <motion.button
                  className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    darkMode
                      ? 'bg-slate-800/50 text-white border-slate-600 hover:bg-slate-700 hover:border-blue-500'
                      : 'bg-white/80 text-gray-700 border-gray-300 hover:border-[#6366F1] hover:bg-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className={darkMode ? 'text-blue-400' : 'text-[#6366F1]'} />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
              <div className={`relative border rounded-3xl p-8 shadow-2xl transition-colors duration-300 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <div className="space-y-4">
                  <ChatBubble message="How can I help you with your exam today?" isAI darkMode={darkMode} />
                  <ChatBubble message="Can you explain the quiz rules?" darkMode={darkMode} />
                  <ChatBubble message="Of course! Let me walk you through the examination guidelines..." isAI darkMode={darkMode} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-800/50' : 'bg-white/40'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Dashboard
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Monitor everything in real-time with our intuitive interface
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl" />
              <div className={`relative border rounded-3xl p-4 shadow-2xl transition-colors duration-300 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`rounded-2xl p-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900' 
                    : 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50'
                }`}>
                  {/* Dashboard Header */}
                  <div className={`flex items-center justify-between mb-6 pb-4 border-b ${
                    darkMode ? 'border-white/10' : 'border-gray-300/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FaChartLine className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Teacher Dashboard</h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-blue-200' : 'text-blue-600'
                        }`}>Live Exam Monitoring</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">Live</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {dashboardStats.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`backdrop-blur-sm rounded-xl p-4 ${
                          darkMode ? 'bg-white/10' : 'bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{stat.value}</div>
                        <div className={`text-xs ${
                          darkMode ? 'text-blue-200' : 'text-blue-600'
                        }`}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity Feed */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`backdrop-blur-sm rounded-xl p-4 ${
                      darkMode ? 'bg-white/10' : 'bg-white/60'
                    }`}>
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <FaBell className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                        Recent Alerts
                      </h4>
                      <div className="space-y-2">
                        {recentAlerts.map((alert, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.color}`} />
                            <div className="flex-1">
                              <p className={darkMode ? 'text-white/90' : 'text-gray-800'}>{alert.text}</p>
                              <p className={`text-xs ${
                                darkMode ? 'text-blue-200/60' : 'text-gray-500'
                              }`}>{alert.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`backdrop-blur-sm rounded-xl p-4 ${
                      darkMode ? 'bg-white/10' : 'bg-white/60'
                    }`}>
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <FaUsers className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                        Active Students
                      </h4>
                      <div className="space-y-2">
                        {activeStudents.map((student, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {student.initials}
                              </div>
                              <span className={darkMode ? 'text-white/90' : 'text-gray-800'}>{student.name}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${student.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/30' : 'bg-white/40'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              About Alice
            </h2>
            <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Alice is an advanced AI-powered exam proctoring platform designed to ensure fairness and integrity in online examinations. Built with cutting-edge technology, we help educational institutions conduct secure, reliable, and efficient remote assessments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-4xl" />,
                title: 'Our Mission',
                description: 'To make online education fair and accessible by providing reliable, AI-powered proctoring solutions that maintain academic integrity.'
              },
              {
                icon: <FaBrain className="text-4xl" />,
                title: 'Our Technology',
                description: 'Leveraging advanced machine learning and computer vision to detect violations in real-time while respecting student privacy.'
              },
              {
                icon: <FaTrophy className="text-4xl" />,
                title: 'Our Impact',
                description: 'Trusted by thousands of institutions worldwide, helping conduct millions of fair examinations every year.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/80 hover:bg-white backdrop-blur-sm'
                }`}
              >
                <div className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {item.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-800/50' : 'bg-transparent'
      }`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Get in Touch
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-8 rounded-3xl ${
              darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white/80 border border-gray-200'
            }`}
          >
            {/* Success/Error Message */}
            {submitStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${
                  submitStatus.type === 'success'
                    ? darkMode
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-green-100 border border-green-300 text-green-700'
                    : darkMode
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                      : 'bg-red-100 border border-red-300 text-red-700'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    darkMode 
                      ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  disabled={isSubmitting}
                  rows="6"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none ${
                    darkMode 
                      ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50'
                    : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-2xl hover:shadow-indigo-500/30'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Mail className="w-5 h-5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: <Mail />, title: 'Email', info: 'contact@aliceproctor.com' },
              { icon: <FaUsers />, title: 'Support', info: '24/7 Live Chat' },
              { icon: <FaShieldAlt />, title: 'Security', info: 'ISO 27001 Certified' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center ${
                  darkMode ? 'bg-slate-800/30' : 'bg-white/60'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                  darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.info}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/30' : 'bg-white/40'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Documentation
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to get started with Alice
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <BookOpen />, title: 'Getting Started', description: 'Quick start guide for new users' },
              { icon: <FileText />, title: 'API Reference', description: 'Complete API documentation' },
              { icon: <HelpCircle />, title: 'Help Center', description: 'FAQs and troubleshooting' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white/80 hover:bg-white'
                }`}
              >
                <div className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {item.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Legal Section - Enhanced */}
      <section id="privacy" className={`relative py-32 px-6 overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
      }`}>
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className={`absolute top-20 right-10 w-72 h-72 rounded-full filter blur-3xl ${
              darkMode ? 'bg-blue-500/10' : 'bg-blue-400/5'
            }`}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className={`absolute bottom-20 left-10 w-72 h-72 rounded-full filter blur-3xl ${
              darkMode ? 'bg-purple-500/10' : 'bg-purple-400/5'
            }`}
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                darkMode 
                  ? 'bg-blue-900/50 border border-blue-700' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <FaShieldAlt className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-sm font-semibold ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Your Trust, Our Priority</span>
            </motion.div>

            <h2 className={`text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode 
                ? 'from-blue-400 via-purple-400 to-pink-400' 
                : 'from-blue-600 via-purple-600 to-pink-600'
            }`}>
              Privacy & Legal
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We take your privacy seriously. Our commitment to data protection and legal compliance ensures a safe and trustworthy platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Terms of Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              id="terms"
              className={`group relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20' 
                  : 'bg-white/90 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                darkMode ? 'bg-blue-500/20' : 'bg-blue-400/10'
              }`} />
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                } shadow-lg`}>
                  <FileText className="text-white text-2xl" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Terms of Service
                </h3>
                
                <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  By using Alice Exam Proctor, you agree to our terms of service. We are committed to providing a fair, secure, and reliable proctoring platform for educational institutions worldwide.
                </p>

                <ul className={`space-y-3 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Fair usage policy for all users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Clear guidelines for exam conduct</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Transparent violation policies</span>
                  </li>
                </ul>

                <button className={`flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3 ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Read Full Terms
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </motion.div>

            {/* Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`group relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20' 
                  : 'bg-white/90 border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/10'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                darkMode ? 'bg-purple-500/20' : 'bg-purple-400/10'
              }`} />
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-purple-600 to-purple-800' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                } shadow-lg`}>
                  <FaLock className="text-white text-2xl" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privacy Policy
                </h3>
                
                <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your privacy is our top priority. We collect only necessary data for exam proctoring and never share your information with third parties without explicit consent.
                </p>

                <ul className={`space-y-3 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>End-to-end encrypted data transmission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Minimal data collection policy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>No third-party data sharing</span>
                  </li>
                </ul>

                <button className={`flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3 ${
                  darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                }`}>
                  View Privacy Policy
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </motion.div>

            {/* Cookie Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              id="cookies"
              className={`group relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/80 border-slate-700 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20' 
                  : 'bg-white/90 border-gray-200 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/10'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                darkMode ? 'bg-pink-500/20' : 'bg-pink-400/10'
              }`} />
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-pink-600 to-pink-800' 
                    : 'bg-gradient-to-br from-pink-500 to-pink-600'
                } shadow-lg`}>
                  <FaClipboardList className="text-white text-2xl" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cookie Policy
                </h3>
                
                <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We use cookies to enhance your experience and maintain session security. You have full control over cookie preferences in your browser settings.
                </p>

                <ul className={`space-y-3 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Essential cookies for functionality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Optional analytics cookies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Customizable preferences</span>
                  </li>
                </ul>

                <button className={`flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3 ${
                  darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
                }`}>
                  Manage Cookies
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </motion.div>

            {/* GDPR Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              id="gdpr"
              className={`group relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-slate-800/80 border-slate-700 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20' 
                  : 'bg-white/90 border-gray-200 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/10'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                darkMode ? 'bg-green-500/20' : 'bg-green-400/10'
              }`} />
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-green-600 to-green-800' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                } shadow-lg`}>
                  <MdSecurity className="text-white text-2xl" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  GDPR Compliance
                </h3>
                
                <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Alice is fully GDPR compliant. We respect your data rights and provide comprehensive tools for data access, correction, and deletion requests.
                </p>

                <ul className={`space-y-3 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Right to access your data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Right to data portability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheck className={`mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span>Right to be forgotten</span>
                  </li>
                </ul>

                <button className={`flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3 ${
                  darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                }`}>
                  Learn About GDPR
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Additional Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`relative p-10 rounded-3xl border backdrop-blur-sm overflow-hidden ${
              darkMode 
                ? 'bg-gradient-to-br from-slate-800/90 via-blue-900/30 to-purple-900/30 border-slate-700' 
                : 'bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 border-gray-200'
            }`}
          >
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl ${
              darkMode ? 'bg-blue-500/10' : 'bg-blue-400/5'
            }`} />
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  darkMode 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                } shadow-lg`}>
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Our Security Commitment
                </h3>
              </div>

              <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We employ industry-leading security measures to protect your data and ensure the integrity of every examination.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-white/80'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <FaLock className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    256-bit Encryption
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bank-level encryption for all data transmission and storage
                  </p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-white/80'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    <FaEye className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Regular Audits
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Third-party security audits and penetration testing
                  </p>
                </div>

                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-white/80'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    darkMode ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <FaBell className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    24/7 Monitoring
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Continuous system monitoring and threat detection
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact for Legal Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`mt-12 text-center p-8 rounded-3xl border ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <Mail className={`mx-auto mb-4 text-4xl ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Have Legal Questions?
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our legal team is here to help. Contact us for any privacy or compliance inquiries.
            </p>
            <button className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20'
            }`}>
              Contact Legal Team
            </button>
          </motion.div>
        </div>
      </section>

      {/* Help & Community Section */}
      <section id="help" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/30' : 'bg-white/40'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help & Community
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get support and connect with other users
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="community"
              className={`p-8 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'}`}
            >
              <FaUsers className={`text-4xl mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Community Forum
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join our community of educators and students. Share experiences, ask questions, and learn from others.
              </p>
              <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                Join Community
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="api"
              className={`p-8 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'}`}
            >
              <HelpCircle className={`text-4xl mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                24/7 Support
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our support team is always here to help. Get instant answers to your questions anytime, anywhere.
              </p>
              <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                darkMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-500' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}>
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className={`py-32 px-6 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900/50' : 'bg-transparent'
      }`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-center text-white shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to conduct fair online exams?
                </h2>
                <p className="text-xl mb-10 text-blue-100">
                  Join thousands of institutions using Alice for secure examinations
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Launch Alice
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <PremiumFooterEnhanced darkMode={darkMode} />
    </div>
  )
}

// Feature Card Component
const FeatureCard = ({ feature, index, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="group relative"
  >
    <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
      darkMode ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10' : 'bg-gradient-to-r from-[#6366F1]/5 to-[#8B5CF6]/5'
    }`} />
    <div className={`relative border rounded-2xl p-8 hover:shadow-xl transition-all duration-200 h-full backdrop-blur-xl ${
      darkMode 
        ? 'bg-slate-800/90 border-slate-700 hover:border-blue-500/50' 
        : 'bg-white/65 border-[rgba(15,23,42,0.06)] hover:border-[#6366F1]/30'
    }`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${
        darkMode 
          ? 'bg-gradient-to-br from-blue-600 to-purple-600'
          : 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]'
      }`}>
        {feature.icon}
      </div>
      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-[#020617]'
      }`}>{feature.title}</h3>
      <p className={`leading-relaxed transition-colors duration-300 ${
        darkMode ? 'text-gray-300' : 'text-[#334155]'
      }`}>{feature.description}</p>
    </div>
  </motion.div>
)

// Step Card Component
const StepCard = ({ step, index, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    className="relative group"
  >
    {/* Glow Effect on Hover */}
    <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
      darkMode ? 'bg-blue-500/30' : 'bg-[#6366F1]/10'
    }`} />

    {/* Card Content */}
    <div className={`relative backdrop-blur-xl border rounded-3xl p-8 transition-all duration-200 ${
      darkMode 
        ? 'bg-white/10 border-white/20 group-hover:bg-white/15 group-hover:border-white/30' 
        : 'bg-white/65 border-[rgba(15,23,42,0.06)] group-hover:bg-white/80 group-hover:border-[#6366F1]/20 group-hover:shadow-xl'
    }`}>
      {/* Icon & Number Badge */}
      <div className="flex items-center justify-center mb-6">
        <motion.div 
          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
              : 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]'
          }`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-3xl text-white">
            {step.icon}
          </div>
          {/* Step Number Badge */}
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
            darkMode 
              ? 'bg-white text-blue-600' 
              : 'bg-[#6366F1] text-white'
          }`}>
            {index + 1}
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-[#020617]'
      }`}>
        {step.title}
      </h3>

      {/* Description */}
      <p className={`leading-relaxed mb-6 transition-colors duration-300 ${
        darkMode ? 'text-blue-200' : 'text-[#334155]'
      }`}>
        {step.description}
      </p>

      {/* Features List */}
      <ul className="space-y-2">
        {step.features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.2 + i * 0.1 }}
            className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
              darkMode ? 'text-blue-100' : 'text-[#334155]'
            }`}
          >
            <FaCheck className={`text-xs flex-shrink-0 ${
              darkMode ? 'text-green-400' : 'text-[#6366F1]'
            }`} />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* Connecting Arrow (Desktop only) */}
      {index < 2 && (
        <motion.div 
          className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.2 }}
        >
          <FaArrowRight className={`text-3xl transition-colors duration-300 ${
            darkMode ? 'text-white/30' : 'text-[#6366F1]/20'
          }`} />
        </motion.div>
      )}
    </div>
  </motion.div>
)

// Chat Bubble Component
const ChatBubble = ({ message, isAI, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: isAI ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
  >
    <div className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-md ${
      isAI 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
        : darkMode 
          ? 'bg-slate-700 text-gray-100'
          : 'bg-gray-100 text-gray-700'
    }`}>
      <p className="text-sm md:text-base">{message}</p>
    </div>
  </motion.div>
)

// Dashboard Stats Data
const dashboardStats = [
  { icon: <FaUsers />, value: '48', label: 'Active Students', color: 'text-blue-400' },
  { icon: <FaVideo />, value: '12', label: 'Live Exams', color: 'text-purple-400' },
  { icon: <FaBell />, value: '3', label: 'Alerts', color: 'text-yellow-400' },
  { icon: <FaCheck />, value: '156', label: 'Completed', color: 'text-green-400' }
]

// Recent Alerts Data
const recentAlerts = [
  { text: 'Multiple faces detected - Student #23', time: '2 min ago', color: 'bg-red-400' },
  { text: 'Tab switch detected - Student #15', time: '5 min ago', color: 'bg-yellow-400' },
  { text: 'Audio anomaly - Student #31', time: '8 min ago', color: 'bg-orange-400' }
]

// Active Students Data
const activeStudents = [
  { name: 'Aditya Singh ', initials: 'A', status: 'active' },
  { name: 'gourav', initials: 'G', status: 'active' },
  { name: 'Bhumi', initials: 'B', status: 'warning' },
  { name: 'Aditya Waghe', initials: 'W', status: 'active' }
]

// Features Data
const features = [
  {
    icon: <MdSecurity className="text-2xl text-white" />,
    title: 'Real-Time AI Monitoring',
    description: 'Advanced AI algorithms monitor exam sessions in real-time, ensuring fair and secure examinations.'
  },
  {
    icon: <FaShieldAlt className="text-2xl text-white" />,
    title: 'Face & Audio Detection',
    description: 'Sophisticated facial recognition and audio analysis to detect and prevent cheating attempts.'
  },
  {
    icon: <FaBell className="text-2xl text-white" />,
    title: 'Live Violation Alerts',
    description: 'Instant notifications when suspicious behavior is detected during examination sessions.'
  },
  {
    icon: <FaChartLine className="text-2xl text-white" />,
    title: 'Role-Based Dashboards',
    description: 'Customized interfaces for students and teachers with relevant tools and insights.'
  },
  {
    icon: <FaLock className="text-2xl text-white" />,
    title: 'Secure Exams',
    description: 'Bank-level encryption and security measures to protect exam integrity and student data.'
  },
  {
    icon: <FaBrain className="text-2xl text-white" />,
    title: 'Alice AI Assistant',
    description: 'Intelligent chatbot providing instant help and support throughout the examination process.'
  }
]

// Steps Data
const steps = [
  {
    icon: <FaClipboardList />,
    title: 'Create Exam',
    description: 'Set up your exam with questions, duration, and proctoring settings in minutes.',
    features: [
      'Custom question types',
      'Flexible time limits',
      'Easy quiz builder'
    ]
  },
  {
    icon: <FaEye />,
    title: 'Monitor with AI',
    description: 'Alice AI monitors students in real-time, detecting violations and suspicious behavior.',
    features: [
      'Face detection',
      'Audio monitoring',
      'Real-time alerts'
    ]
  },
  {
    icon: <FaTrophy />,
    title: 'Get Fair Results',
    description: 'Review comprehensive reports with violation logs and student performance analytics.',
    features: [
      'Detailed analytics',
      'Violation reports',
      'Performance insights'
    ]
  }
]

export default PremiumLandingPage
