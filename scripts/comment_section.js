import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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


let commentsListener = null;  // Declare the listener variable globally

// Function to post a comment
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

    const commentsCollection = collection(db, "comments");

    addDoc(commentsCollection, newComment)
        .then(() => {
            console.log("Comment added successfully!");
        })
        .catch((error) => {
            console.error("Error posting comment:", error);
        });
}

// Function to fetch and display comments
// Function to fetch and display comments without duplicates
function fetchComments() {
    // Reference to the "comments" collection in Firestore
    const commentsCollection = collection(db, "comments");
    const q = query(commentsCollection, orderBy("timestamp", "asc"));

    console.log("Attaching comments listener...");

    // Store seen comments' text to ensure uniqueness
    const seenComments = new Set();

    // Attach the listener for real-time updates
    commentsListener = onSnapshot(q, (querySnapshot) => {
        const commentsList = document.getElementById("comments-list");

        // Clear the comments list before re-rendering
        commentsList.innerHTML = '';

        const currentUser = getAuth().currentUser; // Get the current logged-in user
        querySnapshot.forEach((docSnap) => {
            const comment = docSnap.data();

            // Only render the comment if it's not a duplicate
            if (!seenComments.has(comment.text)) {
                seenComments.add(comment.text);  // Mark this comment's text as seen

                // Call the function to render the individual comment
                renderComment(comment, docSnap.id, currentUser);
            }
        });
    });
}

// Render each comment
function renderComment(comment, commentId, currentUser) {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comments");

    const userDisplayNameRef = doc(db, "user-fullname", comment.userId);
    
    getDoc(userDisplayNameRef)
        .then((userDoc) => {
            const displayName = userDoc.exists() ? userDoc.data().displayName : "Unknown Author";

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

            const commentsList = document.getElementById("comments-list");
            commentsList.appendChild(commentElement);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);

            const userNameElement = document.createElement("span");
            userNameElement.textContent = "Unknown Author: ";
            commentElement.appendChild(userNameElement);

            const commentTextElement = document.createElement("p");
            commentTextElement.textContent = comment.text;
            commentElement.appendChild(commentTextElement);

            const commentsList = document.getElementById("comments-list");
            commentsList.appendChild(commentElement);
        });
}


// Edit comment function
async function editComment(commentId, oldText) {
    const newText = prompt("Edit your comment: ", oldText);
    if (newText) {
        const commentRef = doc(db, "comments", commentId);
        await updateDoc(commentRef, { text: newText });
        console.log("Comment updated!");
    }
}

// Delete comment function
async function deleteComment(commentId) {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
    console.log("Comment deleted!");

    // After deleting a comment, manually update the UI
    fetchComments(); // Re-fetch comments after deleting to ensure up-to-date list
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in as", user.email);
    } else {
        console.log("Logged out");
    }

    fetchComments(); // Call fetchComments on initial load
});

// Handling comment submission
const commentButton = document.getElementById("login-to-comment-btn");
const commentText = document.getElementById("comment-text");

commentButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    const comment = commentText.value.trim();
    if (comment) {
        postComment(comment); // Post the comment
        commentText.value = ""; // Clear input after posting
    } else {
        console.log("Please write a comment before submitting.");
    }
});


