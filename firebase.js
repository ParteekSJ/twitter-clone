// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASTGr7K4hZQ1sw61MpuTHEwR7R5fHlB0E",
  authDomain: "twitter-clone-dfb01.firebaseapp.com",
  projectId: "twitter-clone-dfb01",
  storageBucket: "twitter-clone-dfb01.appspot.com",
  messagingSenderId: "376260086585",
  appId: "1:376260086585:web:fca29486c83d23069c76e8",
  measurementId: "G-L53W2DHGSX",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
