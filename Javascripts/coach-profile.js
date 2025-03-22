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
        console.log("Coach is signed in:", user.email);

        // Fetch coach profile
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid), where("role", "==", "coach"));
            const querySnapshot = await getDocs(q);
            const profileContainer = document.getElementById('coach-profile');
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    profileContainer.innerHTML = `
                        <p>Name: ${data.name}</p>
                        <p>Email: ${data.email}</p>
                        <p>Sport: ${data.sport}</p>
                        <p>Experience: ${data.experience} years</p>
                    `;
                });
            }
        } catch (error) {
            console.error("Error fetching coach profile:", error);
        }
    } else {
        alert("No user is signed in. Redirecting to login.");
        window.location.href = "LoginPage/coach-login.html";
    }
});
