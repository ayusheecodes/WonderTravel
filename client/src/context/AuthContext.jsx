/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wondertravel_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading] = useState(false)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('wondertravel_user', JSON.stringify(userData))
  }

  const updateUser = (updates) => {
    setUser((current) => {
      const next = { ...(current || {}), ...updates }
      localStorage.setItem('wondertravel_user', JSON.stringify(next))
      return next
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wondertravel_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
