import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuqeDjqajIdt2C0rCyMEzWQn10aYVLsKM",
  authDomain: "atkin-4967a.firebaseapp.com",
  projectId: "atkin-4967a",
  storageBucket: "atkin-4967a.appspot.com",
  messagingSenderId: "120569115968",
  appId: "1:120569115968:web:8a389038e29364d8d136a5",
  measurementId: "G-SB910YHPCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to create a new post
async function createPost(content) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            content: content,
            timestamp: new Date().toISOString()
        });
        console.log("Post added with ID: ", docRef.id);
        
        displayPost({ content: content, timestamp: new Date().toISOString() });
        
    } catch (e) {
        console.error("Error adding document: ", e);
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

// Event listener for the post button
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

// Event listener for the profile button
document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = '/Html/profile.html'; // Redirect to the profile page
});
