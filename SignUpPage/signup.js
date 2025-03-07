import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Event listener for the signup button
document.getElementById('signup-btn').addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value.trim();
    const age = document.getElementById('signup-age').value;
    const gender = document.getElementById('signup-gender').value;
    const sport = document.getElementById('signup-sport').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (name && age && gender && sport && email && password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            // Store user info in Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                age: age,
                gender: gender,
                sport: sport,
                email: email,
            });

            console.log('User signed up:', user.email);
            alert('Signup successful! Please log in.');
            window.location.href = '/LoginPage/login.html'; // Redirect to login
        } catch (error) {
            console.error('Error signing up:', error.message);
            alert('Signup failed: ' + error.message);
        }
    } else {
        alert('Please fill in all fields.');
    }
});
