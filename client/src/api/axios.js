import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auto-attach token to every request
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('wondertravel_user')
  if (stored) {
    const user = JSON.parse(stored)
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }
  return config
}, (error) => Promise.reject(error))

// Handle token expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wondertravel_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API
