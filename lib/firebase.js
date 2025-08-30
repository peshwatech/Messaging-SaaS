// File Location: /lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Make sure you have these in your .env.local file
const firebaseConfig = {
  apiKey: "AIzaSyAGU0mQ151zvydBuHN5lnUKIIkPvIzIRgM",
  authDomain: "m-a-v1.firebaseapp.com",
  projectId: "m-a-v1",
  storageBucket: "m-a-v1.firebasestorage.app",
  messagingSenderId: "157711786957",
  appId: "1:157711786957:web:3edda183de518266801a84"
};

// Initialize Firebase for Server-Side Rendering (SSR), prevents re-initialization
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the existing app instance
}

// Export the Firebase services that you will use in your application
export const db = getFirestore(app);
export const auth = getAuth(app);
