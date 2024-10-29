import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBwIT19Tpg3tNZpW6DImeaz0PtIRBlfKaU",
  authDomain: "loan-management-b9de0.firebaseapp.com",
  projectId: "loan-management-b9de0",
  storageBucket: "loan-management-b9de0.appspot.com",
  messagingSenderId: "666118324756",
  appId: "1:666118324756:web:8f11b1fb7f11968cd39d01",
  measurementId: "G-NCWS46KCK1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);