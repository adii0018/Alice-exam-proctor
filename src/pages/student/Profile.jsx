import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiAward, FiTrendingUp, FiEdit2, FiX, FiCamera, FiSave } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { userAPI } from '../../utils/api'
import DashboardLayout from '../../components/student/DashboardLayout'
import UserAvatar from '../../components/common/UserAvatar'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    date_of_birth: user?.date_of_birth || '',
    department: user?.department || ''
  })

  const stats = [
    { icon: FiAward, label: 'Exams Completed', value: '12', color: 'blue' },
    { icon: FiTrendingUp, label: 'Average Score', value: '87%', color: 'green' },
    { icon: FiCalendar, label: 'Member Since', value: 'Jan 2026', color: 'purple' }
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await userAPI.updateProfile(formData)
      updateUser(response.data.user)
      toast.success('Profile updated successfully!')
      setShowEditModal(false)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      date_of_birth: user?.date_of_birth || '',
      department: user?.department || ''
    })
    setShowEditModal(true)
  }

  return (
    <DashboardLayout title="Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white overflow-hidden shadow-2xl"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Animated background layers */}
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-6" style={{ transform: 'translateZ(50px)' }}>
            {/* 3D Avatar */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                {/* Main avatar with UserAvatar component */}
                <div className="relative"
                  style={{
                    transform: 'translateZ(30px)',
                    filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))'
                  }}
                >
                  <UserAvatar
                    user={user}
                    size={128}
                    showBorder={true}
                    borderColor="rgba(255,255,255,0.3)"
                    className="ring-4 ring-white/30 shadow-2xl"
                  />
                </div>

                {/* Camera button with 3D effect */}
                <motion.button 
                  whileHover={{ scale: 1.1, translateZ: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  style={{
                    transform: 'translateZ(40px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  <FiCamera className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Profile Info with 3D cards */}
            <div className="text-center md:text-left flex-1">
              <motion.h2 
                className="text-4xl font-bold mb-2 drop-shadow-lg"
                style={{ 
                  transform: 'translateZ(40px)',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {user?.name || 'Student Name'}
              </motion.h2>
              <motion.p 
                className="text-lg opacity-90 mb-1 drop-shadow-md"
                style={{ transform: 'translateZ(35px)' }}
              >
                {user?.email || 'student@example.com'}
              </motion.p>
              {user?.bio && (
                <motion.p 
                  className="text-sm opacity-80 mt-3 max-w-2xl drop-shadow-md"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {user.bio}
                </motion.p>
              )}
              
              {/* 3D Badges */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  { label: 'Student ID: STU2026001', color: 'from-blue-400 to-blue-600' },
                  { label: 'Active', color: 'from-green-400 to-green-600' },
                  ...(user?.department ? [{ label: user.department, color: 'from-purple-400 to-purple-600' }] : [])
                ].map((badge, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05, translateZ: 10 }}
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} backdrop-blur-sm text-sm font-medium shadow-lg`}
                    style={{
                      transform: `translateZ(${25 + index * 5}px)`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    {badge.label}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* 3D Edit Button */}
            <motion.button
              onClick={openEditModal}
              whileHover={{ scale: 1.05, translateZ: 20 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-6 right-6 p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all border border-white/30 shadow-xl"
              style={{
                transform: 'translateZ(50px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
              }}
            >
              <FiEdit2 className="w-6 h-6 drop-shadow-lg" />
            </motion.button>
          </div>

          {/* Bottom shine effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <Icon className={`w-8 h-8 text-${stat.color}-600 mb-3`} />
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <FiMail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.location || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                <FiCalendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.date_of_birth || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <FiAward className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.department || 'Not set'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New York, USA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

export default Profile
