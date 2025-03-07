import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
  authDomain: "atkin-4967a.firebaseapp.com",
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

// Ensure user is authenticated and fetch user profile information
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const profileData = doc.data();
                    document.getElementById('profile-info').innerHTML = `
                        <p><strong>Name:</strong> ${profileData.name}</p>
                        <p><strong>Email:</strong> ${profileData.email}</p>
                        <p><strong>Age:</strong> ${profileData.age}</p>
                        <p><strong>Gender:</strong> ${profileData.gender}</p>
                        <p><strong>Favorite Sport:</strong> ${profileData.sport}</p>
                    `;
                });
            } else {
                console.error("No user profile found");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }

    } else {
        // No user is signed in, redirect to login page
        alert("You need to log in to view your profile.");
        window.location.href = "/LoginPage/login.html";
    }
});
