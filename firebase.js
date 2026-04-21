const firebaseConfig = {
  apiKey: "AIzaSyBozFBbqUn7nTwbjRC027ACfBaAkY8ocWE",
  authDomain: "clubhub2-226c0.firebaseapp.com",
  projectId: "clubhub2-226c0",
  storageBucket: "clubhub2-226c0.appspot.com",
  messagingSenderId: "473457215975",
  appId: "1:473457215975:web:17c1eb7278a428be175542"
};

// Initialize ONLY ONCE
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
