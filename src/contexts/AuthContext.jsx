// import { createContext, useContext, useState, useEffect } from 'react'
// import axios from '../utils/api'
// import FullPageLoader from '../components/loaders/FullPageLoader'

// const AuthContext = createContext(null)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [authLoading, setAuthLoading] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       // Restore user from localStorage immediately to avoid flash
//       const storedUser = localStorage.getItem('user')
//       if (storedUser) {
//         try { setUser(JSON.parse(storedUser)) } catch { /* ignore */ }
//       }
//       fetchUser() // Still verify token with backend
//     } else {
//       setLoading(false)
//     }
//   }, [])

//   // Normalize user object so both `_id` and `id` are always present
//   const normalizeUser = (u) => ({
//     ...u,
//     _id: u._id || u.id,
//     id: u.id || u._id,
//   })

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get('/api/auth/me/')
//       const user = normalizeUser(response.data)
//       setUser(user)
//       localStorage.setItem('user', JSON.stringify(user))
//     } catch (error) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       delete axios.defaults.headers.common['Authorization']
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email, password) => {
//     setAuthLoading(true)
//     try {
//       const response = await axios.post('/api/auth/login/', { email, password })
//       const { token } = response.data
//       const user = normalizeUser(response.data.user)
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(user))
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       setUser(user)
//       return user
//     } catch (err) {
//       setAuthLoading(false)
//       throw err
//     } finally {
//       setTimeout(() => setAuthLoading(false), 2000)
//     }
//   }

//   const register = async (userData) => {
//     setAuthLoading(true)
//     try {
//       const response = await axios.post('/api/auth/register/', userData)
//       const { token } = response.data
//       const user = normalizeUser(response.data.user)
//       localStorage.setItem('token', token)
//       localStorage.setItem('user', JSON.stringify(user))
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       setUser(user)
//       return user
//     } catch (err) {
//       setAuthLoading(false)
//       throw err
//     } finally {
//       setTimeout(() => setAuthLoading(false), 2000)
//     }
//   }

//   const logout = () => {
//     setAuthLoading(true)
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     delete axios.defaults.headers.common['Authorization']
//     setUser(null)
//     setTimeout(() => setAuthLoading(false), 2000)
//   }

//   const updateUser = (updatedUserData) => {
//     const user = normalizeUser(updatedUserData)
//     setUser(user)
//     localStorage.setItem('user', JSON.stringify(user))
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
//       {authLoading && <FullPageLoader />}
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)


import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import FullPageLoader from '../components/loaders/FullPageLoader'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch { /* ignore */ }
      }
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const normalizeUser = (u) => ({
    ...u,
    _id: u._id || u.id,
    id: u.id || u._id,
  })

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me/')
      const user = normalizeUser(response.data)
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/login/', { email, password })
      const { token } = response.data
      const user = normalizeUser(response.data.user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } catch (err) {
      setAuthLoading(false)
      throw err
    } finally {
      setTimeout(() => setAuthLoading(false), 2000)
    }
  }

  const register = async (userData) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/register/', userData)
      const { token } = response.data
      const user = normalizeUser(response.data.user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } catch (err) {
      setAuthLoading(false)
      throw err
    } finally {
      setTimeout(() => setAuthLoading(false), 2000)
    }
  }

  const googleLogin = async (accessToken, role = 'student') => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/google/', { credential: accessToken, role })
      const { token } = response.data
      const user = normalizeUser(response.data.user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } catch (err) {
      setAuthLoading(false)
      throw err
    } finally {
      setTimeout(() => setAuthLoading(false), 2000)
    }
  }

  const logout = () => {
    setAuthLoading(true)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setTimeout(() => setAuthLoading(false), 2000)
  }

  const updateUser = (updatedUserData) => {
    const user = normalizeUser(updatedUserData)
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {authLoading && <FullPageLoader />}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
