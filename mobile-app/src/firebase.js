import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);