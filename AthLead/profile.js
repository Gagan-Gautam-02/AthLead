const firebaseConfig = {
    apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
    authDomain: "atkin-4967a.firebaseapp.com",
    projectId: "atkin-4967a",
    storageBucket: "atkin-4967a.appspot.com",
    messagingSenderId: "120569115968",
    appId: "1:120569115968:web:8a389038e29364d8d136a5"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const authProfile = firebase.auth();
const dbProfile = firebase.firestore();

authProfile.onAuthStateChanged((user) => {
    if (user) {
        const userRef = dbProfile.collection('users').doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const profileDetails = document.getElementById('profile-details');
                const data = doc.data();
                profileDetails.innerHTML = `
                    <p>Name: ${data.name}</p>
                    <p>Age: ${data.age}</p>
                    <p>Email: ${data.email}</p>
                `;
            } else {
                profileDetails.innerHTML = `<p>No user data found.</p>`;
            }
        }).catch((error) => {
            console.error('Error retrieving user data:', error);
        });
    } else {
        window.location = 'login.html';  // Redirect to login if not authenticated
    }
});