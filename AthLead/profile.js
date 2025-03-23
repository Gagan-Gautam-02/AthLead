const firebaseConfig = {
    apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
    authDomain: "atkin-4967a.firebaseapp.com",
    projectId: "atkin-4967a",
    storageBucket: "atkin-4967a.appspot.com",
    messagingSenderId: "120569115968",
    appId: "1:120569115968:web:8a389038e29364d8d136a5"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
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
                console.log('User signed up and data stored.');
                window.location = 'profile.html'; // Redirect to profile
            })
            .catch((error) => {
                console.error('Error during sign up:', error);
            });
    });
}