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
        const currentUserUid = user.uid;
        const followingListContainer = document.getElementById('following-list');
        
        const followingRef = db.collection('users').doc(currentUserUid).collection('following');
        followingRef.get().then((snapshot) => {
            if (snapshot.empty) {
                followingListContainer.innerHTML = '<p>You are not following anyone yet.</p>';
            } else {
                snapshot.forEach((doc) => {
                    const followedUser = doc.data();
                    followingListContainer.innerHTML += `
                        <div class="followed-user">
                            <p><strong>${followedUser.name}</strong></p>
                        </div>
                    `;
                });
            }
        }).catch((error) => {
            console.error('Error fetching following list:', error);
        });
    } else {
        console.log('User not authenticated, redirecting to login.');
        window.location = 'login.html';
    }
});