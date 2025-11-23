import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDu6avzqpjgzmALOh6Y4aiAXQi-mUu-5Ao",
  authDomain: "brew-cloud-kuejas.firebaseapp.com",
  projectId: "brew-cloud-kuejas",
  storageBucket: "brew-cloud-kuejas.firebasestorage.app",
  messagingSenderId: "989769562466",
  appId: "1:989769562466:web:2be4a6564a48734c58943b",
};

const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db as default, auth, googleProvider };
