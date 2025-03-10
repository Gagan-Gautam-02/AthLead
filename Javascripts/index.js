import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
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
const auth = getAuth(app);
let currentUser = null;

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    currentUser = user;
  } else {
    console.log("No user is signed in.");
    currentUser = null;
  }
});

// Event listeners for navigation
document.getElementById('profile-button').addEventListener('click', () => {
  window.location.href = '/Html/profile.html';
});

document.getElementById('performance-button').addEventListener('click', async () => {
  if (!currentUser) {
    alert("You need to log in to view your performance.");
    return;
  }

  try {
    const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const favoriteSport = userData.sport;
      if (favoriteSport === "Cricket") {
        window.location.href = '/Html/cricket.html';
      } else if (favoriteSport === "Kabaddi") {
        window.location.href = '/Html/kabaddi.html';
      } else {
        console.error("Unknown sport selected");
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Redirect to respective signup/login pages
document.getElementById('athlete-signup-button').addEventListener('click', () => {
  window.location.href = 'athlete-signup.html';
});

document.getElementById('athlete-login-button').addEventListener('click', () => {
  window.location.href = 'athlete-login.html';
});

document.getElementById('coach-signup-button').addEventListener('click', () => {
  window.location.href = 'coach-signup.html';
});

document.getElementById('coach-login-button').addEventListener('click', () => {
  window.location.href = 'coach-login.html';
});

// Implement search functionality
document.getElementById('search-btn').addEventListener('click', async () => {
  const searchInput = document.getElementById('search-input').value.trim();
  const resultsContainer = document.getElementById('search-results');

  if (searchInput) {
    const searchQuery = query(collection(db, "users"), where("name", "==", searchInput));
    try {
      const querySnapshot = await getDocs(searchQuery);
      resultsContainer.innerHTML = `<h3>Search Results</h3>`;
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const resultItem = document.createElement('p');
          resultItem.textContent = `Name: ${data.name}, Email: ${data.email}, Sport: ${data.sport}`;
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML += `<p>No athletes found with the name "${searchInput}".</p>`;
      }
    } catch (error) {
      console.error("Error searching for athletes:", error);
    }
  } else {
    alert("Please enter a name to search.");
  }
});

// Function for creating and displaying posts remains unchanged
