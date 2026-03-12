import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import FullPageLoader from '../components/loaders/FullPageLoader'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me/')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const response = await axios.post('/api/auth/login/', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } finally {
      setTimeout(() => setAuthLoading(false), 2000) // Show loader for 2 seconds
    }
  }

  const register = async (userData) => {
    setAuthLoading(true)
    try {
      const response = await axios.post('/api/auth/register/', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } finally {
      setTimeout(() => setAuthLoading(false), 2000) // Show loader for 2 seconds
    }
  }

  const logout = () => {
    setAuthLoading(true)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setTimeout(() => setAuthLoading(false), 2000) // Show loader for 2 seconds
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {authLoading && <FullPageLoader />}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
