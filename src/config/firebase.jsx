// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDILvqKWcUJpQ5ajHPKPlEqZmjEc9M5htE",
  authDomain: "infoguide-13007.firebaseapp.com",
  projectId: "infoguide-13007",
  storageBucket: "infoguide-13007.firebasestorage.app",
  messagingSenderId: "118200673394",
  appId: "1:118200673394:web:d50f8387ddf29df1ba8eeb",
  measurementId: "G-T2BCB6JJ9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
