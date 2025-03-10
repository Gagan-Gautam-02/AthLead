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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid), where("sport", "==", "Cricket"));
      const querySnapshot = await getDocs(q);
      const statsSection = document.getElementById('stats-section');
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        statsSection.innerHTML = `
          <div class="stat-block">
            <h3>Total Matches</h3>
            <p>${userData.totalMatches || 0}</p>
          </div>
          <div class="stat-block">
            <h3>Total Wins</h3>
            <p>${userData.totalWins || 0}</p>
          </div>
          <div class="stat-block">
            <h3>Average</h3>
            <p>${userData.average || 0}</p>
          </div>
          <div class="stat-block">
            <h3>Highest Score</h3>
            <p>${userData.highestScore || 0}</p>
          </div>
          <div class="stat-block">
            <h3>Centuries</h3>
            <p>${userData.centuries || 0}</p>
          </div>
          <div class="stat-block">
            <h3>Half-Centuries</h3>
            <p>${userData.halfCenturies || 0}</p>
          </div>
        `;
      } else {
        statsSection.innerHTML = "<p>No cricket stats available for the current user.</p>";
      }
    } catch (error) {
      console.error("Error fetching cricket stats:", error);
    }
  } else {
    alert("You need to log in to view this page.");
    window.location.href = "/LoginPage/login.html";
  }
});
