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
      // Bug #16 fix: don't wipe session or redirect for auth endpoints.
      // When /auth/login returns 401 (wrong credentials), the form's own catch
      // block must handle it. Without this guard, the interceptor would clear
      // localStorage and redirect the user — already on /login — causing a
      // confusing reload and erasing any live session data.
      const requestUrl = error.config?.url || ''
      const isAuthEndpoint = requestUrl.includes('/auth/')
      if (!isAuthEndpoint) {
        localStorage.removeItem('wondertravel_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API
