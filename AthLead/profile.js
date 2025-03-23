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
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('uid'); // Get the 'uid' parameter from the URL

        if (userId) {
            const userRef = db.collection('users').doc(userId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('profile-details').innerHTML = `
                        <p>Name: ${userData.name}</p>
                        <p>Age: ${userData.age}</p>
                        <p>Email: ${userData.email}</p>
                    `;
                    // Load posts by this user
                    loadUserPosts(userId);
                } else {
                    console.error('No user profile found.');
                }
            }).catch((error) => {
                console.error('Error retrieving user profile:', error);
            });
        } else {
            console.warn('No user ID found in URL.');
        }
    } else {
        console.log('User not authenticated, redirecting to login.');
        window.location = 'login.html';
    }
});

function loadUserPosts(userId) {
    const userPostsContainer = document.getElementById('user-posts');
    db.collection('posts')
        .where('author', '==', userId)
        .orderBy('timestamp', 'desc')
        .get()
        .then(snapshot => {
            userPostsContainer.innerHTML = ''; // Clear previous posts
            if (snapshot.empty) {
                userPostsContainer.innerHTML = '<p>No posts found.</p>';
            } else {
                snapshot.forEach(doc => {
                    const postData = doc.data();
                    userPostsContainer.innerHTML += `
                        <div class="post">
                            <p>${postData.content}</p>
                            <p><small>${new Date(postData.timestamp.seconds * 1000).toLocaleString()}</small></p>
                        </div>
                    `;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user posts:', error);
        });
}