import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY2,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN2,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID2,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET2,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID2,
  appId: import.meta.env.VITE_FIREBASE_APP_ID2
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app; 