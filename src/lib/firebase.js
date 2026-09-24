import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8OChW3jcdlI547lSRsqoLU75gJZ9PRX0",
  authDomain: "project-a9e46.firebaseapp.com",
  databaseURL: "https://project-a9e46-default-rtdb.firebaseio.com",
  projectId: "project-a9e46",
  storageBucket: "project-a9e46.appspot.com",
  messagingSenderId: "193497908211",
  appId: "1:193497908211:web:fc51c29b68e1c9ede48886",
  measurementId: "G-S41N11WY47"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()