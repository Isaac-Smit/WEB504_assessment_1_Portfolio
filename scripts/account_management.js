import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

const form = document.getElementById('create-account-form');
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const displayName = document.getElementById('full-name').value;
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Send email verification
            sendEmailVerification(user)
                .then(() => {
                    console.log("Verification email sent!");
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error.message);
                });

            // Sign out after account creation to wait for email verification
            signOut(auth)
                .then(() => {
                    console.log("User logged out after creation to wait for email verification.");
                })
                .catch((error) => {
                    console.error("Error logging out user:", error.message);
                });

            // Save user data in "users" collection
            setDoc(doc(db, "users", user.uid), {
                displayName: displayName,
                email: email,
                userId: user.uid
            })
            .then(() => {
                console.log("Congrats, account created!");
                alert("Account created successfully! Please verify your email.");
            })
            .catch((error) => {
                console.error("Error saving user to 'users' collection:", error);
            });

            // Save displayName to "user-fullname" collection
            setDoc(doc(db, "user-fullname", user.uid), {
                displayName: displayName
            })
            .then(() => {
                console.log("Full name added to 'user-fullname' collection!");
            })
            .catch((error) => {
                console.error("Error saving full name to 'user-fullname' collection:", error);
            });

        })
        .catch((error) => {
            console.error("Error creating user:", error.message);
        });
});

// Watch for changes in authentication state (whether the user is logged in or not)
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            console.log("Welcome back, verified user!");
            // Allow access to the rest of your app
        } else {
            console.log("Please verify your email before continuing.");
            // Optionally, prompt the user to send the verification email again
            // Uncomment to allow the user to resend the verification email if they haven't received it
            // user.sendEmailVerification()
            //     .then(() => {
            //         console.log("Verification email re-sent!");
            //     })
            //     .catch((error) => {
            //         console.error("Error re-sending verification email:", error.message);
            //     });
        }
    } else {
        console.log("No user is signed in.");
        // Handle user sign-out state (perhaps redirect to login page)
    }
});
