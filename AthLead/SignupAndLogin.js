const firebaseConfig = {
    apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
    authDomain: "atkin-4967a.firebaseapp.com",
    projectId: "atkin-4967a",
    storageBucket: "atkin-4967a.appspot.com",
    messagingSenderId: "120569115968",
    appId: "1:120569115968:web:8a389038e29364d8d136a5"
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