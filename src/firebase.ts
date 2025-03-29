import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChGT1uTyeSEefHgEzZLY0qhLdZpATt6HI",
  authDomain: "meditation-coach-d4c9b.firebaseapp.com",
  projectId: "meditation-coach-d4c9b",
  storageBucket: "meditation-coach-d4c9b.firebasestorage.app",
  messagingSenderId: "169916790708",
  appId: "1:169916790708:web:004d95dd2b0e46805264e1"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app); 