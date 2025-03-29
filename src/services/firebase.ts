// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   // Replace with your Firebase config
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app); 


import { initializeApp, getApps } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChGT1uTyeSEefHgEzZLY0qhLdZpATt6HI",
  authDomain: "meditation-coach-d4c9b.firebaseapp.com",
  projectId: "meditation-coach-d4c9b",
  storageBucket: "meditation-coach-d4c9b.firebasestorage.app",
  messagingSenderId: "169916790708",
  appId: "1:169916790708:web:004d95dd2b0e46805264e1"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// Initialize Firebase


// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
