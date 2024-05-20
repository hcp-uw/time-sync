// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9kKYERQlumTvH3pPFonAYBLEPX5SWxOw",
  authDomain: "timesync-7171d.firebaseapp.com",
  databaseURL: "https://timesync-7171d-default-rtdb.firebaseio.com",
  projectId: "timesync-7171d",
  storageBucket: "timesync-7171d.appspot.com",
  messagingSenderId: "909312169478",
  appId: "1:909312169478:web:271ce2a5e3f210ddd71587",
  measurementId: "G-H1Q8Z22P9N"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// const db = getFirestore(app)

export { db }