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
        console.log('User is logged in:', user.uid);

        // Setup post submission
        setupPostSubmission(user);

        // Load existing feed
        loadFeed();

        // Setup search functionality
        setupSearch();

    } else {
        console.log('User not authenticated, redirecting to login.');
        window.location = 'login.html';
    }
});

function setupPostSubmission(user) {
    const submitPostButton = document.getElementById('submit-post');
    const postContent = document.getElementById('post-content');

    submitPostButton.addEventListener('click', () => {
        const content = postContent.value.trim();
        if (content) {
            db.collection('posts').add({
                content: content,
                author: user.uid,
                timestamp: new Date()
            }).then(() => {
                console.log('Post added!');
                postContent.value = '';  // Clear textarea
                loadFeed(); // Reload the feed to include new post
            }).catch(error => {
                console.error('Error adding post:', error);
            });
        }
    });
}

function loadFeed() {
    const feedContent = document.getElementById('feed-content');
    db.collection('posts')
        .orderBy('timestamp', 'desc')
        .get()
        .then(snapshot => {
            feedContent.innerHTML = ''; // Clear previous feed
            snapshot.forEach(doc => {
                const postData = doc.data();
                const userRef = db.collection('users').doc(postData.author);
                
                // Fetching user's name for the posts
                userRef.get().then(userDoc => {
                    if (userDoc.exists) {
                        const userName = userDoc.data().name;
                        const userId = userDoc.id;
                        feedContent.innerHTML += `
                            <div class="post">
                                <p><strong><a href="profile.html?uid=${userId}">${userName}</a></strong></p>
                                <p>${postData.content}</p>
                                <p><small>${new Date(postData.timestamp.seconds * 1000).toLocaleString()}</small></p>
                            </div>
                        `;
                    } else {
                        console.log('No user data found for this post.');
                    }
                }).catch(error => {
                    console.error('Error fetching user data:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error loading feed:', error);
        });
}

function setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const queryText = searchInput.value.trim();

            if (queryText) {
                const athletesRef = db.collection('users');
                athletesRef
                    .orderBy('name')
                    .startAt(queryText)
                    .endAt(queryText + '\uf8ff')
                    .get()
                    .then(snapshot => {
                        const resultsContainer = document.querySelector('.search-results');
                        resultsContainer.innerHTML = ''; // Clear previous results

                        if (snapshot.empty) {
                            resultsContainer.innerHTML = '<p>No athletes found.</p>';
                        } else {
                            snapshot.forEach(doc => {
                                const athleteData = doc.data();
                                resultsContainer.innerHTML += `
                                    <div class="athlete">
                                        <p><strong>${athleteData.name}</strong></p>
                                        <p>${athleteData.age} years old</p>
                                        <p>${athleteData.email}</p>
                                    </div>
                                `;
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching athletes:', error);
                    });
            } else {
                resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
            }
        });
    }
}

