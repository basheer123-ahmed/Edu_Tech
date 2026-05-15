import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

/**
 * Firebase Configuration
 * Using the API keys provided for the EduTech project.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDNRM6jTgxmwyK5I7ZX6VxDA_-hswnQfPA",
  authDomain: "edutech-d72eb.firebaseapp.com",
  projectId: "edutech-d72eb",
  storageBucket: "edutech-d72eb.firebasestorage.app",
  messagingSenderId: "683795590134",
  appId: "1:683795590134:web:ace1b88b0d5b3315d6f5d7",
  measurementId: "G-Z225FRVPVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export Auth functions needed for Phone Authentication
export { RecaptchaVerifier, signInWithPhoneNumber };

export default app;
