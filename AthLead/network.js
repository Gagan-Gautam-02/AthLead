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