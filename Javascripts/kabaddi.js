import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and display kabaddi stats
async function fetchKabaddiStats() {
    const statsRef = collection(db, "kabaddiStats");
    const statsSnapshot = await getDocs(statsRef);
    const statsList = statsSnapshot.docs.map(doc => doc.data());

    const statsSection = document.getElementById('stats-section');
    statsList.forEach((stat) => {
        const p = document.createElement('p');
        p.textContent = `Player: ${stat.player}, Points: ${stat.points}, Matches: ${stat.matches}`;
        statsSection.appendChild(p);
    });
}

fetchKabaddiStats();
