// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
