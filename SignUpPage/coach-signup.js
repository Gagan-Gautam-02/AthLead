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
    const experience = parseInt(document.getElementById('signup-experience').value, 10);

    if (name && email && password && experience) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            // Store coach info in Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                email: email,
                experience: experience,
                role: "coach"
            });

            alert('Signup successful! Please log in.');
            window.location.href = '/LoginPage/coach-login.html';
        } catch (error) {
            console.error('Error during signup:', error.message);
            alert('Signup failed: ' + error.message);
        }
    } else {
        alert('Please fill in all fields.');
    }
});
