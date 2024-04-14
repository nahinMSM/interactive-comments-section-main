import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyB_aX-M8mR49FarSIwf4SiFZBQVjWZiF94",
  authDomain: "interactive-comments-45624.firebaseapp.com",
  projectId: "interactive-comments-45624",
  storageBucket: "interactive-comments-45624.appspot.com",
  messagingSenderId: "912156972724",
  appId: "1:912156972724:web:a7d231c67d4ef95b4769e1"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const db = getFirestore()

export const saveTask = (Commit) =>
  addDoc(collection(db, "tasks"), { Commit })

export const onGetTasks = (callback) =>
  onSnapshot(collection(db, "tasks"), callback)

export const saveMyComment = (comment) =>
  addDoc(collection(db, "myComment"), { comment })

export const onGetMyComment = (callback) =>
  onSnapshot(collection(db, "myComment"), callback)

export const deleteTask = (id) => deleteDoc(doc(db, "tasks", id))

export const getTask = (id) => getDoc(doc(db, "tasks", id))

export const updateTask = (id, newFields) =>
  updateDoc(doc(db, "tasks", id), newFields)

export const deleteMyComment = (id) => deleteDoc(doc(db, "myComment", id))

export const updateComment = (id, newFields) =>
  updateDoc(doc(db, "myComment", id), newFields)