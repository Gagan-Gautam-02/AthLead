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
        const userId = user.uid;

        const sportsForm = document.getElementById('sports-form');
        const performanceDataContainer = document.getElementById('day-plans');
        const startTrackingButton = document.getElementById('start-tracking');
      
        // Load user's existing sport if available
        const userRef = db.collection('users').doc(userId);

        userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const savedSport = userData.sports;
                if (savedSport) {
                    document.getElementById('sports').value = savedSport;
                    loadDayPlans(savedSport, performanceDataContainer, userId);
                }
            }
        });

        // Save sport and load performance data
        sportsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const selectedSport = sportsForm['sports'].value;
            userRef.update({ sports: selectedSport }).then(() => {
                console.log('Sport saved successfully!');
                loadDayPlans(selectedSport, performanceDataContainer, userId);
            }).catch((error) => {
                console.error('Error saving sport:', error);
            });
        });

        // Start Tracking
        startTrackingButton.addEventListener('click', () => {
            userRef.collection('tracking').doc('day1').set({ completed: false })
                .then(() => {
                    loadDayPlans(document.getElementById('sports').value, performanceDataContainer, userId);
                    console.log('Started tracking for day 1');
                });
        });

    } else {
        console.log('User not authenticated, redirecting to login.');
        window.location = 'login.html';
    }
});

function loadDayPlans(sport, container, userId) {
    container.innerHTML = ''; // Clear previous plans

    // Simple mockup of 5 days of plans, extend as needed
    for (let day = 1; day <= 5; day++) {
        const dayDoc = db.collection('users').doc(userId).collection('tracking').doc(`day${day}`);

        dayDoc.get().then((doc) => {
            let isComplete = false;
            if (doc.exists) {
                isComplete = doc.data().completed;
            }
            const planContent = `
                <div class="day-plan ${isComplete ? 'complete' : ''}" id="day-${day}">
                    <span>Day ${day} ${sport} Plan</span>
                    <button class="tick-button">${isComplete ? 'Completed' : 'Complete Task'}</button>
                </div>
            `;
            container.innerHTML += planContent;

            const tickButton = document.querySelector(`#day-${day} .tick-button`);
            tickButton.addEventListener('click', () => {
                // Update Firestore and UI to reflect completion
                if (!isComplete) {
                    dayDoc.set({ completed: true }).then(() => {
                        tickButton.innerText = 'Completed';
                        tickButton.parentElement.classList.add('complete');
                        console.log(`Task for Day ${day} completed.`);
                    });
                }
            });
        });
    }
}