/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // BUG-19 fix: JSON.parse throws synchronously inside the useState initializer
    // if localStorage contains a corrupted or truncated value (e.g. after a
    // storage-quota error mid-write). This would crash the entire React tree with
    // no recovery path. Wrapping in try/catch silently discards bad data and
    // starts the user in a logged-out state instead.
    try {
      const saved = localStorage.getItem('wondertravel_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      localStorage.removeItem('wondertravel_user')
      return null
    }
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
