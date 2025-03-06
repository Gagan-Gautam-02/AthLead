// /js/signup-script.js

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const regNumber = document.getElementById('Reg-number').value;
    const mobile = document.getElementById('mobile').value;
    const accommodation = document.getElementById('accommodation').value;
    const email = document.getElementById('email').value;
    const major = document.getElementById('major').value;
    const year = document.getElementById('year').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name,
            regNumber,
            mobile,
            accommodation,
            email,
            major,
            year
        });

        // Send email verification
        await sendEmailVerification(user);
        
        alert('Sign up successful! A verification email has been sent to your email address. Please verify your email before logging in.');

    } catch (error) {
        console.error("Error during signup: ", error);
        alert(`Signup failed: ${error.message}`);
    }
});

// Optional: You can add logic to periodically check if the user's email has been verified
