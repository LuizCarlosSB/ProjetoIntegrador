// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Adicione esta importação

const firebaseConfig = {
  apiKey: "AIzaSyDRuaqMHZSqd2qjarIVkfu7dI_HKdLbKKc",
  authDomain: "cryptlock-fd0f9.firebaseapp.com",
  projectId: "cryptlock-fd0f9",
  storageBucket: "cryptlock-fd0f9.appspot.com",
  messagingSenderId: "335340534266",
  appId: "1:335340534266:web:96d26887b54ad681984c43"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app); // Crie a instância de autenticação

export { db, auth }; // Exporte ambos