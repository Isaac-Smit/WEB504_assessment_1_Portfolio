import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


// Initialize Firebase
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

// Function to show notification after login
function showSignedInNotification() {
    // Hide all other containers
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("create-account-form-container").style.display = "none";

    // Show the signed-in notification
    const notification = document.getElementById("signed-in-notification");
    notification.style.display = "flex"; // Ensure it uses flex for proper layout

    // Set the message inside the signed-in div
    const signedInMessage = document.querySelector(".signed-in");
    signedInMessage.textContent = "Signed in!"; // Update the message

    // Update the main navigation login button to "Log Off"
    const loginBtn = document.querySelector(".nav-login-button");
    loginBtn.textContent = "Log Off";
    loginBtn.onclick = handleLogout; // Set click event to handleLogout for logging out
}

// Event Listener for the Login Form
const form = document.getElementById('login-email-form');
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Check if the email is verified
            if (user.emailVerified) {
                showSignedInNotification(); // Call this upon successful login
            } else {
                // If not verified, log the user out and show alert
                signOut(auth)
                    .then(() => {
                        alert("You need to verify your email before logging in. Please check your inbox.");
                    })
                    .catch((error) => {
                        console.error("Error logging out:", error.message);
                    });
            }
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
            alert("Error logging in: " + error.message);
        });
});

// Function to handle user logout
function handleLogout() {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");

            // Revert the navigation login button to "Login" after logout
            const loginBtn = document.querySelector(".nav-login-button");
            loginBtn.textContent = "Login";
            loginBtn.onclick = openPopup; // Reset click handler to open login popup

            closePopup(); // Close the popup if it was open
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

// Function to open the login popup
function openPopup() {
    const popup = document.getElementById("login-popup");
    popup.style.display = "flex";
}

// Function to close the login popup
function closePopup() {
    const popup = document.getElementById("login-popup");
    popup.style.display = "none";
}
