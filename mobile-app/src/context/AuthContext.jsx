import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToSupabase = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return null;

    const fullName = additionalData.full_name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
    const firstName = fullName.split(' ')[0] || '';
    const lastName = fullName.split(' ').slice(1).join(' ') || '';

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
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(userData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    setProfile(data);
    return data;
  };

  const syncUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    setUser(firebaseUser);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', firebaseUser.uid)
      .single();

    if (data) {
      setProfile(data);
    } else {
      await saveUserToSupabase(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      await syncUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (fullName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToSupabase(userCredential.user, { full_name: fullName });
    return userCredential.user;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};