// Firebase v10 (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBozFBbqUn7nTwbjRC027ACfBaAkY8ocWE",
  authDomain: "clubhub2-226c0.firebaseapp.com",
  projectId: "clubhub2-226c0",
  storageBucket: "clubhub2-226c0.appspot.com", // ✅ FIXED
  messagingSenderId: "473457215975",
  appId: "1:473457215975:web:17c1eb7278a428be175542"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
