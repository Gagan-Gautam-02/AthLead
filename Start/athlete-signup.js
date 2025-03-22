import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Event listener for signup form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const age = parseInt(document.getElementById('signup-age').value, 10);
    const sport = document.getElementById('signup-sport').value;

    if (name && email && password && age && sport) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            // Store athlete info in Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                email: email,
                age: age,
                sport: sport,
                role: "athlete"
            });

            alert('Signup successful!');
            window.location.href = 'Html/index.html'; // Redirect to index or dashboard
        } catch (error) {
            console.error('Error during signup:', error.message);
            alert('Signup failed: ' + error.message);
        }
    } else {
        alert('Please fill in all fields.');
    }
});