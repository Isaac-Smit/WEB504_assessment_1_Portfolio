//import the firebase modules and functons we are using through the script
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

//setting firebase config (again lol)
const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
};

//initializing the firebase app and setting up authentication and firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const commentsCollection = collection(db, "comments");

let commentsListener = null;

//calling fetchComments function to display comments on page load
fetchComments();



// declare a function call 'postComment' accepting the comment text as the parameter,
// we then get the login in state of the user. if the user isn't logged in they are notified
// and the function is exited. Otherwise a 'new comment' is declared, then we add that comment
// to the commentsCollection variable which references the comments collection in firestore.
function postComment(commentText) {
    const currentUser = getAuth().currentUser;

    if (!currentUser) {
        alert("You must be logged in to post a comment.");
        return;
    }

    const newComment = {
        userId: currentUser.uid,
        text: commentText,
        edited: false,
        timestamp: serverTimestamp(),
    };
    console.log("ADD DOC");
    addDoc(commentsCollection, newComment)
        .then(() => {
            console.log("Comment added successfully!");
        })
        .catch((error) => {
            console.error("Error posting comment:", error);
        });
}



// Function to fetch and display comments without duplicates
function fetchComments() {
    // Reference to the "comments" collection in Firestore through a query declaration.
    // ordering them in asceding order based on timestamp.
    const q = query(commentsCollection, orderBy("timestamp", "asc"));
  
    console.log("Attaching comments listener...");
  
    // Attach the listener for real-time updates (triggers whenever a change to the firestore data)
    commentsListener = onSnapshot(q, (querySnapshot) => {
      console.log("Show me when Snapshot fires!");
      const commentsList = document.getElementById("comments-list");
        //declare comments list as the html element comments-list

      const currentUser = getAuth().currentUser; // Get the current logged-in user
      
      const commentElementsPromises = [];
      //looping through the query snap shot containing the comments
      //passing the comment data, the current user and the comments user id
      //we call the 'renderComment' function for the html element
      //then collect the promises in their own array
      querySnapshot.forEach((docSnap) => {
        const comment = docSnap.data();
        commentElementsPromises.push(
          renderComment(comment, docSnap.id, currentUser)
        );
      });
  
      // Once all the promises are retrurned, then we will clear & refresh the UI element
      // Doing it this way ensures we don't have collisions if more than one onSnapshot handler is resolving
      Promise.all(commentElementsPromises).then((commentElements) => {
        commentsList.innerHTML = "";
        commentElements.forEach((commentElement) => {
          commentsList.appendChild(commentElement);
        });
      });
    });
  }

// Declare an async function 'renderComment'
async function renderComment(comment, commentId, currentUser) {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comments");
    //declare a constant html element "div" and add the class "comments" to it.


    const userDisplayNameRef = doc(db, "user-fullname", comment.userId);
  //declare the display name reference as the comment.userId row from user-fullname collection in firestore


  //try to retrieve the display name based on userId, if displayName doesnt exist, use "Unknown Author"
    try {
      const userDoc = await getDoc(userDisplayNameRef);
      const displayName = userDoc.exists()
        ? userDoc.data().displayName
        : "Unknown Author";
  
        //build individual comments, starting with displayName, then appending it
        //to the 'comments' div, if the current user and the userId matches, we create
        //a button div and append an edit and delete button and append them to their own
        //div. Then return the finished element to update the current list.
      const userNameElement = document.createElement("span");
      userNameElement.textContent = `${displayName}: `;
      commentElement.appendChild(userNameElement);
  
      const commentTextElement = document.createElement("p");
      commentTextElement.textContent = comment.text;
      commentElement.appendChild(commentTextElement);
  
      if (currentUser && comment.userId === currentUser.uid) {
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("comment-buttons-container");
  
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("comment-buttons");
        editBtn.onclick = () => editComment(commentId, comment.text);
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("comment-buttons");
        deleteBtn.onclick = () => deleteComment(commentId);
  
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);
        commentElement.appendChild(buttonsDiv);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
  
      const userNameElement = document.createElement("span");
      userNameElement.textContent = "Unknown Author: ";
      commentElement.appendChild(userNameElement);
  
      const commentTextElement = document.createElement("p");
      commentTextElement.textContent = comment.text;
      commentElement.appendChild(commentTextElement);
    }
  
    return commentElement;
  }


// declare async function 'editComment' accepting the commentId and original text content of
// the comment as parameters. we then declare a new text variable which is prompting
// the user with a dialog box pre fillex with the comments original text.
// if the there is 'new text', meaning the text has changed, we then
// create a comment reference which is shot at the specific comment id in firestore
// we then await the updateDoc function for firestore to update the old text
// with the new text.
async function editComment(commentId, oldText) {
    const newText = prompt("Edit your comment: ", oldText);
    if (newText) {
        const commentRef = doc(db, "comments", commentId);
        await updateDoc(commentRef, { text: newText });
        console.log("Comment updated!");
    }
}

// Declare an async function 'deleteComment" accepting the commentId as a parameter
// declare a constant comment reference which is directed at the firestore comments collection
// aimed at commentIds. Then we await the firestore function 'deleteDoc' using
// our firestore reference as the parameter.
async function deleteComment(commentId) {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
    console.log("Comment deleted!");
}

// using firebase function 'onAuthStateChanged' to ensure we always know who's logged in.
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in as", user.email);
    } else {
        console.log("Logged out");
    }
});



// declare a function called 'updateCommentButton' accepting the 'user' state as a parameter.
// establishing the reference to the html button we want this function to target.
// if a user is logged in, the button will say "Submit Comment!" and on click
// will submit the contents in the field 'comment-text', trimming all extra spaces from the comment
// if nothing is in the field user will be prompted to enter a comment.
// else if the user isn't logged in and they click the button, they will be told to login
// then the screen will auto scroll to the top so they can.
function updateCommentButton(user) {
    const commentBtn = document.getElementById('login-to-comment-btn'); 

    if (user) {
        // If the user is logged in
        commentBtn.textContent = "Submit Comment!";  // Change button text
        commentBtn.disabled = false;  // Enable the button
        commentBtn.onclick = function () {

            const commentText = document.getElementById("comment-text");
            const comment = commentText.value.trim();
            if (comment) {
                postComment(comment); // Post the comment
                commentText.value = ""; // Clear input after posting
            } else {
                console.log("Please write a comment before submitting.");
            }
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

// listening for the authentication changes using firebase function
getAuth().onAuthStateChanged(function (user) {
    updateCommentButton(user);
})

//calling the button update function whenever the authication state changes
updateCommentButton(auth.currentUser);





