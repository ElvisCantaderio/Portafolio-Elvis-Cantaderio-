import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  doc,
  query,
  limit,
  getDoc,
  deleteDoc,
  GeoPoint,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref as storageRef } from "firebase/storage";

import "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Agregar configuración firebase:
const firebaseConfig = {
  apiKey: "AIzaSyAGhv1dZm3tWdYTMusyR5KkU0nmKviJ8CE",
  authDomain: "atrasvasoloapp.firebaseapp.com",
  projectId: "atrasvasoloapp",
  storageBucket: "atrasvasoloapp.appspot.com",
  messagingSenderId: "1065922454951",
  appId: "1:1065922454951:web:0051c0006a696e8d0e8282",
  measurementId: "G-HTDCLYJPP7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth(app);

export {
  doc,
  updateDoc,
  auth,
  signInWithRedirect,
  db,
  collection,
  getDocs,
  setDoc,
  storage,
  storageRef,
  addDoc,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  query,
  getDoc,
  limit,
  deleteDoc,
  getRedirectResult,
  GeoPoint,
  setPersistence,
  browserLocalPersistence,
};

//se agrega el auth
