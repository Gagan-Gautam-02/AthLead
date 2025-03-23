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

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is logged in:', user);

        // Populate homepage or profile page data
        const userId = user.uid;
        const userRef = db.collection('users').doc(userId);

        userRef.get().then((doc) => {
            if (doc.exists) {
                console.log('User data:', doc.data());
                // Use user data to personalize UI, optionally
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.error('Error getting document:', error);
        });

        // Handle search submit
        document.getElementById('search-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const queryText = document.getElementById('search-input').value.trim().toLowerCase();

            if (queryText) {
                const athletesRef = db.collection('users');
                athletesRef
                    .where('name', '>=', queryText)
                    .where('name', '<=', queryText + '\uf8ff')
                    .get()
                    .then((snapshot) => {
                        const resultsContainer = document.querySelector('.search-results');
                        resultsContainer.innerHTML = ''; // Clear previous results

                        if (snapshot.empty) {
                            resultsContainer.innerHTML = '<p>No athletes found.</p>';
                        } else {
                            snapshot.forEach((doc) => {
                                const athleteData = doc.data();
                                const athleteElement = `
                                    <div class="athlete">
                                        <p><strong>${athleteData.name}</strong></p>
                                        <p>${athleteData.age} years old</p>
                                        <p>${athleteData.email}</p>
                                    </div>
                                `;
                                resultsContainer.innerHTML += athleteElement;
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching athletes:', error);
                    });
            }
        });
    } else {
        window.location = 'login.html'; // Redirect to login if not authenticated
    }
});