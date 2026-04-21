
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBozFPbqUn7nTwbjRC027ACfbAakY8ocwE",
  authDomain: "clubhub2-226c0.firebaseapp.com",
  projectId: "clubhub2-226c0",
  storageBucket: "clubhub2-226c0.firebasestorage.app",
  messagingSenderId: "473457215975",
  appId: "1:473457215975:web:6a53f91f6ac0add1175542"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

// Make global
window.auth = auth;
window.db = db;
