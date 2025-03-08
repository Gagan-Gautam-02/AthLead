import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = '/Html/profile.html';
});

document.getElementById('performance-button').addEventListener('click', async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const favoriteSport = userData.sport;
                    if (favoriteSport === "Cricket") {
                        window.location.href = '/Html/cricket.html';
                    } else if (favoriteSport === "Kabaddi") {
                        window.location.href = '/Html/kabaddi.html';
                    } else {
                        console.error("Unknown sport selected");
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            alert("You need to log in to view your performance.");
        }
    });
});

// Function to create a new post
async function createPost(content) {
    try {
        const postsRef = collection(db, "posts");
        await addDoc(postsRef, {
            content: content,
            timestamp: new Date().toISOString()
        });
        console.log("Post added!");
        
        displayPost({ content: content, timestamp: new Date().toISOString() });
    } catch (e) {
        console.error("Error adding post:", e);
    }
}

// Function to display a single post
function displayPost(postData) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `<p>${postData.content}</p><small>${new Date(postData.timestamp).toLocaleString()}</small>`;
    const feedElement = document.getElementById('feed');
    feedElement.insertBefore(postElement, feedElement.firstChild);
}

document.getElementById('post-btn').addEventListener('click', () => {
    const content = document.getElementById('post-content').value.trim();
    if (content) {
        createPost(content);
        document.getElementById('post-content').value = '';
    } else {
        alert('Please write something before posting.');
    }
});

// Function to load posts from Firestore
async function loadPosts() {
    const postsRef = collection(db, "posts");
    const postsSnapshot = await getDocs(postsRef);
    const postsList = postsSnapshot.docs.map(doc => doc.data());

    const feedElement = document.getElementById('feed');
    feedElement.innerHTML = '<h3>Your News Feed</h3>';
    postsList.forEach(postData => {
        displayPost(postData);
    });
}

window.addEventListener('load', loadPosts);
