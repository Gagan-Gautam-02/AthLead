import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Fetch and display kabaddi players' stats
async function fetchKabaddiPlayers() {
    const q = query(collection(db, "users"), where("sport", "==", "Kabaddi"));
    const querySnapshot = await getDocs(q);

    const statsSection = document.getElementById('stats-section');
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const p = document.createElement('p');
        p.textContent = `Name: ${userData.name}, Age: ${userData.age}, Email: ${userData.email}`;
        statsSection.appendChild(p);
    });
}

fetchKabaddiPlayers();
