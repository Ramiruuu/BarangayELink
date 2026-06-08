import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const storedUser = typeof window !== 'undefined' ? window.localStorage.getItem('barangayAdminUser') : null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null)

  const login = ({ email, password }) => {
    const safeEmail = String(email).toLowerCase()
    if (safeEmail.includes('admin') || safeEmail.includes('barangay28')) {
      const userData = {
        name: 'Barangay 28 Administrator',
        email: safeEmail,
      }
      setUser(userData)
      window.localStorage.setItem('barangayAdminUser', JSON.stringify(userData))
      console.log('Admin signed in', userData)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('barangayAdminUser')
    console.log('Admin logged out')
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
