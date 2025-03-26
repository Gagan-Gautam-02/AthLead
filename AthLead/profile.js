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
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('uid'); // The UID of the profile being viewed
        const currentUserUid = user.uid; // Current logged-in user ID

        if (userId) {
            // Reference to the user's profile
            const userRef = db.collection('users').doc(userId);
            const followingRef = db.collection('users').doc(currentUserUid).collection('following').doc(userId);

            // Fetch profile information
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('profile-details').innerHTML = `
                        <p>Name: ${userData.name}</p>
                        <p>Age: ${userData.age}</p>
                        <p>Email: ${userData.email}</p>
                        <p>Sports: ${userData.sports || 'Not specified'}</p>
                        <p>Experience: ${userData.experience ? userData.experience.replace(/\n/g, '<br>') : 'Not specified'}</p>
                        <p>Achievements: ${userData.achievements ? userData.achievements.replace(/\n/g, '<br>') : 'Not specified'}</p>
                        <button id="follow-button">Follow</button>
                        <p id="follow-status"></p>
                    `;

                    // Check if already following this user
                    followingRef.get().then((followDoc) => {
                        if (followDoc.exists) {
                            document.getElementById('follow-button').innerText = 'Unfollow';
                        }

                        // Add follow/unfollow functionality
                        document.getElementById('follow-button').addEventListener('click', () => {
                            followingRef.get().then((followDoc) => {
                                if (followDoc.exists) {
                                    followingRef.delete().then(() => {
                                        document.getElementById('follow-button').innerText = 'Follow';
                                        console.log(`Unfollowed ${userData.name}`);
                                    });
                                } else {
                                    followingRef.set({ name: userData.name }).then(() => {
                                        document.getElementById('follow-button').innerText = 'Unfollow';
                                        console.log(`Following ${userData.name}`);
                                    });
                                }
                            });
                        });
                    });
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
