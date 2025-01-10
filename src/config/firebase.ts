import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVS-lUmQlGRFBXVw0VuBcVthDL6lzUy3k",
  authDomain: "food-app-f44f5.firebaseapp.com",
  projectId: "food-app-f44f5",
  storageBucket: "food-app-f44f5.appspot.com",
  messagingSenderId: "803675581400",
  appId: "1:803675581400:web:8360a8edbeebeb5de5e0ad",
  measurementId: "G-BRNGCVYN2E"
};

// Initialize Firebase
let app;
let auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('Firebase initialized with persistence');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
