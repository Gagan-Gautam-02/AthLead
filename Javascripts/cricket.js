import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
  authDomain: "atkin-4967a.firebaseapp.com",
  databaseURL: "https://atkin-4967a-default-rtdb.firebaseio.com",
  projectId: "atkin-4967a",
  storageBucket: "atkin-4967a.appspot.com",
  messagingSenderId: "120569115968",
  appId: "1:120569115968:web:8a389038e29364d8d136a5",
  measurementId: "G-SB910YHPCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Ensure user-specific data fetch and UI update
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid), where("sport", "==", "Cricket"));
      const querySnapshot = await getDocs(q);
      const statsSection = document.getElementById('stats-section');
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        statsSection.innerHTML = `
          <p>Name: ${userData.name}</p>
          <p>Age: ${userData.age}</p>
          <p>Email: ${userData.email}</p>
          <p>Favorite Sport: ${userData.sport}</p>
        `;
      } else {
        statsSection.innerHTML = "<p>No cricket stats available for the current user.</p>";
      }
    } catch (error) {
      console.error("Error fetching cricket stats:", error);
    }
  } else {
    alert("You need to log in to view this page.");
    window.location.href = "login.html";
  }
});
