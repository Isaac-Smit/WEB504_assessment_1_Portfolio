
//For the account management JS we import the app initlization again, but this time we import the firebase auth module since we
//are going to authenticate users (specifically with email and password) so we import the build in firebase-auth functions we will use
//getAuth, sendEmailVerificatio, signOut and onAuthStateChanged
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Again set up the standard firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
};

//same variables to initialise the application
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('create-account-form');
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const displayName = document.getElementById('full-name').value;
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;

    try {
        // Attempt to create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data in Firestore
        const db = getFirestore(app);
        await setDoc(doc(db, "users", user.uid), {
            displayName: displayName,
            email: email,
            userId: user.uid
        });
    

        // Show the "Account created" notification and hide the "Signed in" notification
        document.getElementById('account-created-notification').style.display = 'block';
        document.getElementById('signed-in-notification').style.display = 'none';

        // Send email verification
        await sendEmailVerification(user);
        console.log("Verification email sent!");

        // Save displayName to "user-fullname" collection
        await setDoc(doc(db, "user-fullname", user.uid), {
            displayName: displayName
        });
        console.log("Full name added to 'user-fullname' collection!");

        // Sign out after account creation to wait for email verification
        await signOut(auth);
        console.log("User logged out after creation to wait for email verification.");

    } catch (error) {
        console.error("Error during account creation process:", error);
        if (error.code === 'auth/email-already-in-use') {
            alert("This email is already associated with an account.");
        } else {
            alert("An unexpected error occurred. Please try again later.");
        }
    }
});

// Watch for changes in authentication state (whether the user is logged in or not)
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            console.log("Welcome back, verified user!");
            // Allow access to the rest of your app
        } else {
            console.log("Please verify your email before continuing.");
        }
    } else {
        console.log("No user is signed in.");
        // Handle user sign-out state (perhaps redirect to login page)
    }
});
