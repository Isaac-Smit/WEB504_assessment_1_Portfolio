
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en'
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function() {
    signInWithPopup(auth, provider)
        .then ((result) => {
            const user = result.user;

            showSignedInNotification();

            // Prepare user data to store
            const userData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
            };

            // Save user data in Firestore
            return setDoc(doc(db, 'users', user.uid), userData); // Properly add data to Firestore
        }).catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
    });
})

function showSignedInNotification() {
    // Hide all other containers
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("create-account-form-container").style.display = "none";

    // Display the signed-in notification
    const notification = document.getElementById("signed-in-notification");
    notification.style.display = "flex"; // Ensure it uses flex for proper layout

    // Set the message in the signed-in container
    const signedInMessage = document.querySelector(".signed-in");
    signedInMessage.textContent = "Signed in!"; // Set the correct message

    // Update the main navigation login button to "Log Off"
    const loginBtn = document.querySelector(".nav-login-button");
    loginBtn.textContent = "Log Off";
    loginBtn.onclick = handleLogout; // Call handleLogout when clicked
}

// Handle logout functionality
function handleLogout() {
    const auth = getAuth();
    console.log("Logging out is impossible!")
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");

            // Revert the navigation login button to "Login"
            const loginBtn = document.querySelector(".nav-login-button");
            loginBtn.textContent = "Login";
            loginBtn.onclick = openPopup; // Reset click handler to open the login popup

            // Hide signed-in notification and show the login form again
            document.getElementById("signed-in-notification").style.display = "none";
            document.getElementById("login-btn").style.display = "block"; // Show login button again

        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}
