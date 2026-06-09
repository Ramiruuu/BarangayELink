// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase.js'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
} from 'firebase/auth'
import { supabase } from '../supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Save or update user in Supabase
  const saveUserToSupabase = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) {
      console.log('No firebase user provided')
      return null
    }

    try {
      const fullName = additionalData.full_name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      const firstName = fullName.split(' ')[0] || ''
      const lastName = fullName.split(' ').slice(1).join(' ') || ''

      const userData = {
        user_id: firebaseUser.uid,
        email: firebaseUser.email || additionalData.email || '',
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone_number: additionalData.phone || '',
        role_code: 'RESIDENT',
        is_active: true,
        updated_at: new Date().toISOString(),
      }

      // Use upsert to either insert or update
      const { data, error } = await supabase
        .from('profiles')
        .upsert(userData, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return null
      }

      console.log('User saved to Supabase:', data)
      setProfile(data)
      return data

    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }

  // Load profile from Supabase
  const loadProfile = async (userId) => {
    if (!userId) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        return null
      }

      setProfile(data)
      return data

    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }

  // Sync user with Supabase
  const syncUserWithSupabase = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null)
      setProfile(null)
      return
    }

    setUser(firebaseUser)

    // First try to load existing profile
    let existingProfile = await loadProfile(firebaseUser.uid)

    if (!existingProfile) {
      // If no profile exists, create one
      existingProfile = await saveUserToSupabase(firebaseUser)
    }

    if (!existingProfile) {
      console.log('Warning: Could not sync user with Supabase')
    }
  }

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user')
      setLoading(true)

      if (firebaseUser) {
        await syncUserWithSupabase(firebaseUser)
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Google Sign In
  const signInWithGoogle = async () => {
    console.log('Starting Google sign in...')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Google sign in success:', result.user.email)
      await syncUserWithSupabase(result.user)
      return result.user
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Facebook Sign In
  const signInWithFacebook = async () => {
    console.log('Starting Facebook sign in...')
    const provider = new FacebookAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Facebook sign in success:', result.user.email)
      await syncUserWithSupabase(result.user)
      return result.user
    } catch (error) {
      console.error('Facebook sign in error:', error)
      throw error
    }
  }

  // Email/Password Signup
  const signup = async (full_name, email, password) => {
    console.log('Starting email signup:', email)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      if (full_name) {
        await firebaseUpdateProfile(userCredential.user, { displayName: full_name })
      }

      await sendEmailVerification(userCredential.user)
      await syncUserWithSupabase(userCredential.user)

      console.log('Email signup success:', email)
      return userCredential.user
    } catch (error) {
      console.error('Email signup error:', error)
      throw error
    }
  }

  // Email/Password Login
  const login = async (email, password) => {
    console.log('Logging in with email:', email)

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await syncUserWithSupabase(result.user)
      return result.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Complete Phone Signup
  const completePhoneSignup = async (fullName, phoneNumber, firebaseUid) => {
    console.log('Completing phone signup for:', phoneNumber)

    try {
      const currentUser = auth.currentUser

      if (!currentUser || currentUser.uid !== firebaseUid) {
        throw new Error('User not found')
      }

      await syncUserWithSupabase(currentUser, {
        full_name: fullName,
        phone: phoneNumber,
      })

      return currentUser
    } catch (error) {
      console.error('Phone signup error:', error)
      throw error
    }
  }

  // Forgot Password
  const resetPassword = async (email) => {
    console.log('Sending password reset to:', email)
    await sendPasswordResetEmail(auth, email)
  }

  // Logout
  const logout = async () => {
    console.log('Logging out')
    await signOut(auth)
    setUser(null)
    setProfile(null)
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in')

    console.log('Updating profile:', updates)

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.uid)

    if (error) throw error

    setProfile(prev => ({ ...prev, ...updates }))
    return true
  }

  // Get user role
  const getUserRole = () => profile?.role_code || 'RESIDENT'

  // Check if admin
  const isAdmin = () => {
    const role = getUserRole()
    return role === 'ADMIN' || role === 'SUPER_ADMIN'
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      signInWithGoogle,
      signInWithFacebook,
      completePhoneSignup,
      updateProfile,
      getUserRole,
      isAdmin,
    }),
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