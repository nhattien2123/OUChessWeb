import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/firestore"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCdnPJoQ0mlSTVQb3XR_Y3zSRBCtC7KtRU",
    authDomain: "ouchess.firebaseapp.com",
    projectId: "ouchess",
    storageBucket: "ouchess.appspot.com",
    messagingSenderId: "748905092392",
    appId: "1:748905092392:web:b8d94269e7c386170eec1d",
    measurementId: "G-3JLS882YKX",
  };
  
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  
  export const db = getFirestore(app);