import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// Initalize firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
}

// declare firebase variables for later use
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const form = document.getElementById('create-account-form');
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            // User successfully signed up
            // Save additional user data in Firestore
            setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                userId: user.uid
            })
            .then(() => {
                console.log("Congrats, account created!")
                alert("Account created successfully!");
            })
            .catch((error) => {
                console.error("Error saving user to database:", error);
            });
        })
        .catch((error) => {
            console.error("Error creating user:", error.message);
        });
});
