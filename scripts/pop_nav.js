// functions for navigating through the pop menu.
//when clicking the login button, add 'active' to the class list which will open it
function openPopup () {
    document.getElementById("login-popup").classList.add("active");
    resetForms();
}

//to close remove 'active' from the class list
function closePopup() {
    document.getElementById("login-popup").classList.remove("active");
}

//function to hide the forms for the 'default' pop up veiw.
function resetForms() {
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("create-account-form-container").style.display = "none";
}

//function to show the login form when the login button is clicked
function showLoginForm() {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("login-form-container").style.display = "block";
    document.getElementById("create-account-form-container").style.display = "none";
}

//function to show the create account form when the corresponding button is clicked.
function showCreateAccountForm() {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("login-form-container").style.display = "none";
    document.getElementById("create-account-form-container").style.display = "block";
}

// Close popup when clicking outside the form area
document.getElementById("login-popup").addEventListener("click", function (event) {
    if (event.target === this) closePopup();
});

