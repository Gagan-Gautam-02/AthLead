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

document.getElementById('profile-button').addEventListener('click', () => {
  window.location.href = 'profile.html';
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
          window.location.href = 'cricket.html';
      } else if (favoriteSport === "Kabaddi") {
          window.location.href = 'kabaddi.html';
      } else {
          console.error("Unknown sport selected");
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Function for creating and displaying posts remains unchanged
