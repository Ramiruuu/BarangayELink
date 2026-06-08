import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase.js'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth'
import { supabase } from '../supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name,phone')
          .eq('id', firebaseUser.uid)
          .single()

        if (!error && data) {
          setProfile(data)
        } else {
          setProfile({
            full_name: firebaseUser.displayName || '',
            phone: '',
          })
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const signup = async (full_name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await firebaseUpdateProfile(result.user, { displayName: full_name })
    await supabase.from('profiles').upsert({
      id: result.user.uid,
      email,
      full_name,
      phone: '',
    })
    setProfile({ full_name, phone: '' })
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({ user, profile, loading, login, signup, logout }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
