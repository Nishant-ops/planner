import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDk8E7Z4RoX0jUmtgNHnDUG9ilxyvMoDkQ",
  authDomain: "noter-a6094.firebaseapp.com",
  projectId: "noter-a6094",
  storageBucket: "noter-a6094.firebasestorage.app",
  messagingSenderId: "807405084469",
  appId: "1:807405084469:web:6014b19aab6d8d7dcf767c",
  measurementId: "G-JKJNEC3V5T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics (optional)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
