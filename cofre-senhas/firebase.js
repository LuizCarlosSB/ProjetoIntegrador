// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeYZ6E5mDegP5s5Yrdb07UWvIFeAKOsZs",
  authDomain: "cryptolock-98306.firebaseapp.com",
  projectId: "cryptolock-98306",
  storageBucket: "cryptolock-98306.firebasestorage.app",
  messagingSenderId: "963615367298",
  appId: "1:963615367298:web:8b168fa32507c50442149b",
  measurementId: "G-LQSL99JB0S"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);