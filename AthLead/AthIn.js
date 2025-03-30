const firebaseConfig = {
    apiKey: "AIzaSyB8NYQSC8QMM9AKM0m3bofLNICw00RsPv0",
    authDomain: "athlead-9e4d0.firebaseapp.com",
    databaseURL: "https://athlead-9e4d0-default-rtdb.firebaseio.com",
    projectId: "athlead-9e4d0",
    storageBucket: "athlead-9e4d0.firebasestorage.app",
    messagingSenderId: "548897577535",
    appId: "1:548897577535:web:941f9b17f3083f6677f68a",
    measurementId: "G-J1DWWFBM16"
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

        // Setup toggle post functionality
        const togglePostButton = document.getElementById('toggle-post');
        const postSection = document.querySelector('.new-post');

        togglePostButton.addEventListener('click', () => {
            postSection.classList.toggle('hidden');
        });

        // Setup post submission listener
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
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('Post added!');
                postContent.value = '';  // Clear the textarea
                loadFeed(); // Reload the feed to include the new post
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
                            <div class="post-item">
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
    const resultsContainer = document.querySelector('.search-results');

    if (searchForm && searchInput && resultsContainer) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const queryText = searchInput.value.trim();

            if (queryText) {
                const athletesRef = db.collection('users');
                athletesRef
                    .where('name', '>=', queryText)
                    .where('name', '<=', queryText + '\uf8ff')
                    .get()
                    .then(snapshot => {
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