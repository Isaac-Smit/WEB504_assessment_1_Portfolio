
const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
    measurementId: "G-LZEERTM3QW"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app)



  function openPopup() {
    document.getElementById("login-popup").classList.add("active");
    resetForms(); // Start with the initial form visible each time
}

function closePopup() {
    document.getElementById("login-popup").classList.remove("active");
}

// Reset all forms and show initial login buttons
function resetForms() {
    document.getElementById("login-btn").style.display = "block"; // Show initial login options
    document.getElementById("login-form-container").style.display = "none"; // Hide login form
    document.getElementById("create-account-form-container").style.display = "none"; // Hide create account form
}

// Function to show the login form
function showLoginForm() {
    document.getElementById("login-btn").style.display = "none"; // Hide initial options
    document.getElementById("login-form-container").style.display = "block"; // Show login form
    document.getElementById("create-account-form-container").style.display = "none"; // Hide create account form
}

// Function to show the create account form
function showCreateAccountForm() {
    document.getElementById("login-btn").style.display = "none"; // Hide initial options
    document.getElementById("login-form-container").style.display = "none"; // Hide login form
    document.getElementById("create-account-form-container").style.display = "block"; // Show create account form
}

// Close popup when clicking outside the form area
document.getElementById("login-popup").addEventListener("click", function(event) {
    if (event.target === this) closePopup();
});




