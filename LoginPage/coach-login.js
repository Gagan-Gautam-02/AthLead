import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);

// Event listener for login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (email && password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            window.location.href = '/Html/index.html';
        } catch (error) {
            console.error('Error during login:', error.message);
            alert('Login failed: ' + error.message);
        }
    } else {
        alert('Please enter both email and password.');
    }
});
