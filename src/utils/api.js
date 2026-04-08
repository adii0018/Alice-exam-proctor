import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Quiz APIs
export const quizAPI = {
  getAll: () => api.get('/quizzes/'),
  getById: (id) => api.get(`/quizzes/${id}/`),
  getByCode: (code) => api.get(`/quizzes/by-code/${code}/`),
  create: (data) => api.post('/quizzes/', data),
  update: (id, data) => api.put(`/quizzes/${id}/update/`, data),
  delete: (id) => api.delete(`/quizzes/${id}/delete/`),
  submit: (id, data) => api.post(`/quizzes/${id}/submit/`, data)
}

// Flag APIs
export const flagAPI = {
  getAll: () => api.get('/flags/'),
  create: (data) => api.post('/flags/create/', data),
  update: (id, data) => api.put(`/flags/${id}/update/`, data)
}

// Violation APIs
export const violationAPI = {
  getAll: (params) => api.get('/violations/', { params }),
  getByQuizStudents: (quizId) => api.get(`/violations/quiz/${quizId}/students/`),
}

// Student scoped dashboard
export const studentAPI = {
  dashboard: () => api.get('/student/dashboard/'),
}

// User/Profile APIs
export const userAPI = {
  getCurrentUser: () => api.get('/auth/me/'),
  updateProfile: (data) => api.put('/auth/profile/', data)
}

export default api
