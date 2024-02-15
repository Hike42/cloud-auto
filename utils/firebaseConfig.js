import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Importez getFirestore
import { getStorage } from 'firebase/storage'; // Importez getStorage

const firebaseConfig = {
  apiKey: 'AIzaSyD2hSzuDZeJaLMyWv1jFIS-rXq_7heWKZw',
  authDomain: 'hikeauth-9e9c9.firebaseapp.com',
  projectId: 'hikeauth-9e9c9',
  storageBucket: 'hikeauth-9e9c9.appspot.com',
  messagingSenderId: '518355435400',
  appId: '1:518355435400:web:c8362c113269725987c43d',
  measurementId: 'G-PTQ2237HVV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Pour l'authentification
export const db = getFirestore(app); // Pour Firestore
export const storage = getStorage(app); // Pour Firebase Storage
