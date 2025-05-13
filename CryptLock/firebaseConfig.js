// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRuaqMHZSqd2qjarIVkfu7dI_HKdLbKKc",
  authDomain: "cryptlock-fd0f9.firebaseapp.com",
  projectId: "cryptlock-fd0f9",
  storageBucket: "cryptlock-fd0f9.appspot.com",
  messagingSenderId: "335340534266",
  appId: "1:335340534266:web:96d26887b54ad681984c43"
};

// Verifica se já existe algum app iniciado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exporta o Firestore
const db = getFirestore(app);

export { db };
