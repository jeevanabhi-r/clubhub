
const firebaseConfig = {
  apiKey: "AIzaSyBozFPbqUn7nTwbjRC027ACfbAakY8ocwE",
  authDomain: "clubhub2-226c0.firebaseapp.com",
  projectId: "clubhub2-226c0",
  storageBucket: "clubhub2-226c0.firebasestorage.app",
  messagingSenderId: "473457215975",
  appId: "1:473457215975:web:e55f4c56cf8c96d5175542"
};


// Initialize ONLY ONCE
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
