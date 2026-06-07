import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiC0VHXCWyZJqzhMNhC0ZaV0LeZM-08Zw",
  authDomain: "smartrestaurant-98b4c.firebaseapp.com",
  projectId: "smartrestaurant-98b4c",
  storageBucket: "smartrestaurant-98b4c.firebasestorage.app",
  messagingSenderId: "768296215517",
  appId: "1:768296215517:web:b6f41b7be125d1b4538c34",
  measurementId: "G-9GXHR1LHJZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);