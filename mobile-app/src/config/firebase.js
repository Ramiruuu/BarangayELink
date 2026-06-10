import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA98f8ffUiKR5ydsA09yTHOU-vrGC0O_VY",
  authDomain: "communityhelp-61b83.firebaseapp.com",
  databaseURL: "https://communityhelp-61b83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "communityhelp-61b83",
  storageBucket: "communityhelp-61b83.firebasestorage.app",
  messagingSenderId: "952459664876",
  appId: "1:952459664876:web:964bce93909e2c518274c9",
  measurementId: "G-6F6HQ5XRM7"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };