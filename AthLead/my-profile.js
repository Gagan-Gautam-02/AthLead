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
        const userId = user.uid;

        // Fetch and display the user's profile information
        const userRef = db.collection('users').doc(userId);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                displayUserProfile(userData);
                loadMyPosts(userId);
            } else {
                console.error('No user profile found.');
            }
        }).catch((error) => {
            console.error('Error retrieving user profile:', error);
        });

        // Set up form submission listener for updating profile
        const editProfileForm = document.getElementById('edit-profile-form');
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateUserProfile(userRef, editProfileForm);
        });

    } else {
        console.log('User not authenticated, redirecting to login.');
        window.location = 'login.html';
    }
});

// Function to append new experiences and achievements to existing profile data
function updateUserProfile(userRef, form) {
    const newSports = form['sports-input'].value;
    const newExperience = form['experience-input'].value;
    const newAchievements = form['achievements-input'].value;

    userRef.get().then((doc) => {
        if (doc.exists) {
            const currentData = doc.data();

            // Append new data, ensuring existing newline separation where needed
            const updatedSports = currentData.sports ? `${currentData.sports}, ${newSports}` : newSports;
            const updatedExperience = currentData.experience ? `${currentData.experience}\n${newExperience}` : newExperience;
            const updatedAchievements = currentData.achievements ? `${currentData.achievements}\n${newAchievements}` : newAchievements;

            // Update data in Firestore
            userRef.update({
                sports: updatedSports,
                experience: updatedExperience,
                achievements: updatedAchievements
            }).then(() => {
                console.log('Profile updated successfully!');
                alert('Profile updated successfully!');
                form.reset(); // Optional: Clear the form inputs after submission
                displayUserProfile({
                    ...currentData,
                    sports: updatedSports,
                    experience: updatedExperience,
                    achievements: updatedAchievements
                });
            }).catch((error) => {
                console.error('Error updating profile:', error);
            });
        }
    }).catch((error) => {
        console.error('Error retrieving current user data:', error);
    });
}

// Function to display user profile information on the page
function displayUserProfile(userData) {
    document.getElementById('name').innerText = userData.name;
    document.getElementById('age').innerText = userData.age;
    document.getElementById('email').innerText = userData.email;
    document.getElementById('sports').innerText = userData.sports || 'Not specified';
    document.getElementById('experience').innerHTML = userData.experience ? userData.experience.replace(/\n/g, '<br>') : 'Not specified';
    document.getElementById('achievements').innerHTML = userData.achievements ? userData.achievements.replace(/\n/g, '<br>') : 'Not specified';
}

// Function to load user's posts and display them
function loadMyPosts(userId) {
    const myPostsContainer = document.getElementById('my-posts');
    db.collection('posts')
        .where('author', '==', userId)
        .orderBy('timestamp', 'desc')
        .get()
        .then(snapshot => {
            myPostsContainer.innerHTML = ''; // Clear previous posts
            if (snapshot.empty) {
                myPostsContainer.innerHTML = '<p>No posts found.</p>';
            } else {
                snapshot.forEach(doc => {
                    const postData = doc.data();
                    myPostsContainer.innerHTML += `
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