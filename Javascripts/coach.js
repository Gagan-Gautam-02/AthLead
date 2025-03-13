import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

let selectedAthleteDocId = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Coach is signed in:", user.email);

        // Fetch coach profile
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid), where("role", "==", "coach"));
            const querySnapshot = await getDocs(q);
            const profileContainer = document.getElementById('coach-profile');
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    profileContainer.innerHTML = `
                        <p>Name: ${data.name}</p>
                        <p>Email: ${data.email}</p>
                        <p>Experience: ${data.experience} years</p>
                    `;
                });
            }
        } catch (error) {
            console.error("Error fetching coach profile:", error);
        }
    } else {
        alert("No user is signed in. Redirecting to login.");
        window.location.href = "LoginPage/coach-login.html";
    }
});

document.getElementById('search-athlete-btn').addEventListener('click', async () => {
    const searchInput = document.getElementById('search-athlete-input').value.trim();
    if (searchInput) {
        const q = query(collection(db, "users"), where("name", "==", searchInput), where("role", "==", "athlete"));
        try {
            const querySnapshot = await getDocs(q);
            const resultsContainer = document.getElementById('search-athlete-results');
            resultsContainer.innerHTML = `<h3>Search Results</h3>`;
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    selectedAthleteDocId = doc.id;
                    resultsContainer.innerHTML += `
                        <p>Name: ${data.name}, Sport: ${data.sport}</p>
                        <button onclick="displayUpdateForm()">Update Stats</button>
                    `;
                });
            } else {
                resultsContainer.innerHTML += `<p>No athletes found with the name "${searchInput}".</p>`;
            }
        } catch (error) {
            console.error("Error searching for athletes:", error);
        }
    } else {
        alert("Please enter a name to search.");
    }
});

function displayUpdateForm() {
    document.getElementById('update-stats-section').style.display = 'block';
}

document.getElementById('update-stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedAthleteDocId) {
        alert("No athlete selected for updating stats.");
        return;
    }

    const totalMatches = parseInt(document.getElementById('update-total-matches').value) || 0;
    const totalWins = parseInt(document.getElementById('update-total-wins').value) || 0;
    const average = parseFloat(document.getElementById('update-average').value) || 0;
    const highestScore = parseInt(document.getElementById('update-highest-score').value) || 0;
    const centuries = parseInt(document.getElementById('update-centuries').value) || 0;
    const halfCenturies = parseInt(document.getElementById('update-half-centuries').value) || 0;

    try {
        const athleteRef = doc(db, "users", selectedAthleteDocId);
        await updateDoc(athleteRef, {
            totalMatches,
            totalWins,
            average,
            highestScore,
            centuries,
            halfCenturies
        });

        alert("Athlete stats updated successfully!");
        document.getElementById('update-stats-form').reset();
        document.getElementById('update-stats-section').style.display = 'none';
    } catch (error) {
        console.error("Error updating athlete stats:", error);
    }
});
