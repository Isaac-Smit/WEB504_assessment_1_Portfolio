import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 


//reference messages collection
const messagesRef = collection(db, 'messages')



document.getElementById('contact-form').addEventListener('submit', submitForm);

function submitForm(e){
e.preventDefault();

//Get values
const firstName = getInputVal('first-name')
const lastName = getInputVal('last-name')
const email = getInputVal('email')
const message = getInputVal('message')

saveMessage(firstName, lastName, email, message)

//show alert
document.querySelector('.alert').style.display = 'block';

//hide alert after 3 seconds
setTimeout(function(){
document.querySelector('.alert').style.display = 'none';
},3000)

document.getElementById('contact-form').requestFullscreen();

}

//function to get form values
function getInputVal(id) {
    return document.getElementById(id).value;
}

//save message to firebase
function saveMessage(firstName, lastName, email, message) {
    addDoc(messagesRef, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message
    })
    .then(() => {
        console.log('Message saved to Firestore');
    })
    .catch((error) => {
        console.error('Error adding message to Firestore: ', error);
    });
}
