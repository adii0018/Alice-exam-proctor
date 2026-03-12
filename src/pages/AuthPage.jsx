import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLeaf, FaShieldAlt, FaBrain, FaChartLine } from 'react-icons/fa'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-20 -left-40 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-40 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <FaLeaf className="text-blue-600" />
        <span className="font-medium">Alice</span>
      </Link>

      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="space-y-8">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaLeaf className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Alice
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">Exam Proctor</p>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  Secure Online
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Examinations
                  </span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  AI-powered proctoring for fair and trustworthy online exams
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: <FaShieldAlt />, text: 'Bank-level security & encryption' },
                  { icon: <FaBrain />, text: 'Advanced AI monitoring' },
                  { icon: <FaChartLine />, text: 'Real-time analytics & insights' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Trusted by 10,000+ institutions
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Glassmorphic Card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 lg:p-10">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaLeaf className="text-white text-xl" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Alice
                  </span>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isLogin 
                      ? 'Sign in to continue to Alice Exam Proctor' 
                      : 'Start conducting secure AI-proctored exams'}
                  </p>
                </div>

                {/* Form Component */}
                {isLogin ? (
                  <LoginForm onToggle={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onToggle={() => setIsLogin(true)} />
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default AuthPage
