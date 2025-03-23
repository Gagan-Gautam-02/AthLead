auth.onAuthStateChanged((user) => {
    if (user) {
        // We are in the main page context, load specific data
        const userId = user.uid;
        const userRef = db.collection('users').doc(userId);
        
        userRef.get().then((doc) => {
            if (doc.exists) {
                // Assuming we have a placeholder for user-specific content
                document.querySelector(".feed").innerHTML = `
                    <article class="post">
                        <h2>Welcome back, ${doc.data().name}!</h2>
                        <p>Here's your personalized feed.</p>
                    </article>
                `;
            } else {
                console.log("No user data found!");
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    } else {
        window.location = 'login.html'; // Redirect to login if not authenticated
    }
});
