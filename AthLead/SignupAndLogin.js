const firebaseConfig = {
    apiKey: "AIzaSyCOYChgzDK9lFj7Zskw96BPbTo23DVf3zw",
    authDomain: "athlead-30cf1.firebaseapp.com",
    databaseURL: "https://athlead-30cf1-default-rtdb.firebaseio.com",
    projectId: "athlead-30cf1",
    storageBucket: "athlead-30cf1.firebasestorage.app",
    messagingSenderId: "447310751131",
    appId: "1:447310751131:web:fca3254842d1500aae2d3e",
    measurementId: "G-HZGFGP2Q34"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Signup function
if (document.getElementById('signup-form')) {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = signupForm['name'].value;
        const age = signupForm['age'].value;
        const email = signupForm['email'].value;
        const password = signupForm['password'].value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return db.collection('users').doc(userCredential.user.uid).set({
                    name: name,
                    age: age,
                    email: email
                });
            })
            .then(() => {
                console.log('User signed up and data stored!');
                window.location = 'AthIn.html'; // Redirect to homepage
            })
            .catch((error) => {
                console.error('Error signing up:', error);
            });
    });
}

// Login function
if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User logged in!');
                window.location = 'AthIn.html';  // Redirect to homepage
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
    });
}