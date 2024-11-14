import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


function updateCommentButton(user) {
    const commentBtn = document.getElementById('login-to-comment-btn'); // Reference to the button

    if (user) {
        // If the user is logged in
        commentBtn.textContent = "Submit Comment!";  // Change button text
        commentBtn.disabled = false;  // Enable the button
        commentBtn.onclick = function () {
            // Handle the comment submission action here (submit the comment, etc.)
            console.log("Comment Submitted!");
        };
    } else {
        // If the user is logged out
        commentBtn.textContent = "Login to comment!";  // Reset button text
        commentBtn.disabled = false;  // Disable the button

        // Allow the button to still scroll the page to the top when clicked
        commentBtn.onclick = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });  // Smooth scroll to top
            alert('You need to be logged in to comment!');
        };
    }
}

getAuth().onAuthStateChanged(function (user) {
    updateCommentButton(user);
})

updateCommentButton(auth.currentUser);
