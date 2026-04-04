import { useState, useEffect } from 'react'
import { flagAPI } from '../../utils/api'
import toast from 'react-hot-toast'
import { FaExclamationTriangle, FaCheck, FaFilter } from 'react-icons/fa'
import { useTheme } from '../../contexts/ThemeContext'

const FlagMonitor = () => {
  const { darkMode } = useTheme()
  const [flags, setFlags] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      const response = await flagAPI.getAll()
      setFlags(response.data)
    } catch (error) {
      toast.error('Failed to load violations')
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id) => {
    try {
      await flagAPI.update(id, { status: 'resolved' })
      toast.success('Violation resolved')
      fetchFlags()
    } catch (error) {
      toast.error('Failed to resolve violation')
    }
  }

  const filteredFlags = filter === 'all' 
    ? flags 
    : flags.filter(f => f.severity === filter)

  const getSeverityColor = (severity) => {
    if (!darkMode) {
      switch (severity) {
        case 'low': return 'bg-yellow-100 text-yellow-800'
        case 'medium': return 'bg-orange-100 text-orange-800'
        case 'high': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
    // Dark mode colors
    switch (severity) {
      case 'low': return 'bg-yellow-500/20 text-yellow-400'
      case 'medium': return 'bg-orange-500/20 text-orange-400'
      case 'high': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return <div className={`text-center py-12 ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>Loading violations...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-[#e6edf3]' : 'text-gray-900'}`}>
          <FaExclamationTriangle className={darkMode ? 'text-orange-400' : 'text-orange-500'} />
          Violation Monitor
        </h2>
        <div className="flex gap-2">
          {['all', 'low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg capitalize flex items-center gap-2 transition-all ${
                filter === level
                  ? darkMode 
                    ? 'bg-[#2ea043] text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter className="text-sm" />
              {level}
            </button>
          ))}
        </div>
      </div>

      {filteredFlags.length === 0 ? (
        <div className={`rounded-xl p-8 text-center border ${
          darkMode 
            ? 'bg-[#161b22] border-[#30363d]' 
            : 'bg-white border-gray-200'
        }`}>
          <p className={darkMode ? 'text-[#8b949e]' : 'text-gray-600'}>No violations found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlags.map((flag) => (
            <div 
              key={flag._id} 
              className={`rounded-xl p-6 border ${
                darkMode 
                  ? 'bg-[#161b22] border-[#30363d]' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(flag.severity)}`}>
                      {flag.severity}
                    </span>
                    <span className={darkMode ? 'text-[#8b949e]' : 'text-gray-600'}>{flag.type}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>
                    Student: {flag.student_name || 'Unknown'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-[#8b949e]' : 'text-gray-600'}`}>
                    Quiz: {flag.quiz_title || 'Unknown'}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-[#6e7681]' : 'text-gray-500'}`}>
                    {new Date(flag.timestamp).toLocaleString()}
                  </p>
                </div>
                
                {flag.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(flag._id)}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-all ${
                      darkMode
                        ? 'bg-[#2ea043] hover:bg-[#2c974b] text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FaCheck />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FlagMonitor
