import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCCGJdGl0d5gONVmNiEWCdXG6FeHPQCuPE",
    authDomain: "web502-portfolio.firebaseapp.com",
    projectId: "web502-portfolio",
    storageBucket: "web502-portfolio.firebasestorage.app",
    messagingSenderId: "655916256395",
    appId: "1:655916256395:web:c7b0ba82b11597e038988e",
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

document.addEventListener("DOMContentLoaded", fetchComments);

//Create function to post comment (and add the comment to firestore)
async function postComment(commentText) {
    const user = getAuth().currentUser;

    try {
        //set the format of the data being added to the firestore
        const docRef = await addDoc(collection(db, "comments"), {
            text: commentText,
            userId: user.uid,
            timestamp: serverTimestamp(),
            edited: false
        });
        console.log("Comment added with ID: ", docRef.id);
        fetchComments(); //reload to see new comment added
    } catch (e) {
        console.error("Error adding comment to database: ", e);
    }
}

//declare function for collecting, declare the collection variable and set it to the comments collection preset in firestore.
function fetchComments() {
    const commentsCollection = collection(db, "comments");
    // declare a constant query that orders the comments by the time/date they were posted
    const q = query(commentsCollection, orderBy("timestamp", "asc"));

    // declare snapshot to catch the new or changed comments
    onSnapshot(q, async (querySnapshot) => { // Make this function async to await getDoc()
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = '';  // Clear the current comments list

        const currentUser = getAuth().currentUser;
        
        // querySnapshot is used as a callback function to contain the updated comment list.
        // Declare commentsList and then clear the list to prepare for the new data.

        for (const docSnapshot of querySnapshot.docs) {
            const comment = docSnapshot.data(); // Get the comment data from Firestore document
            const commentElement = document.createElement("div");
            commentElement.classList.add("comments");

            // Retrieve the fullName from Firestore based on userId (comment.userId)
            const userRef = doc(db, "user-fullname", comment.userId); // Reference to the user document
            try {
                const userDoc = await getDoc(userRef); // Wait for the user document to be fetched
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const fullNameDiv = document.createElement("div");
                    fullNameDiv.classList.add("comment-author");
                    fullNameDiv.textContent = userData.fullName || "Anonymous"; // Display the user's full name or "Anonymous"
                    commentElement.appendChild(fullNameDiv);
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }

            // Append the comment text
            const textDiv = document.createElement("div");
            textDiv.classList.add("comment-text");
            textDiv.textContent = comment.text;
            commentElement.appendChild(textDiv);

            // If the current user is the one who posted the comment, show edit and delete buttons
            if (currentUser && comment.userId === currentUser.uid) {
                const buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("comment-buttons-container");

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("comment-buttons");
                editBtn.onclick = () => editComment(docSnapshot.id, comment.text);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("comment-buttons");
                deleteBtn.onclick = () => deleteComment(docSnapshot.id);
                
                // Append the edit and delete buttons to the comment
                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(deleteBtn);

                commentElement.appendChild(buttonsDiv);
            }

            // Append the final comment element to the comments list
            commentsList.appendChild(commentElement);
        }
    });
}



//declare async function 'editComment' that takes paramaters of the comment id and the original text.
async function editComment(commentId, oldText) {
    //then declare a variable the is a prompt that holds the original text that can be changed.
    const newText = prompt("Edit your comment: ", oldText);
    if (newText) {
        const commentRef = doc(db, "comments", commentId);
        await updateDoc(commentRef, {
            text: newText
        });
        console.log("comment updated!")
        //if there oldtext has been changed, it is then considered "new text", we then save that change
        //to the comment attached to the comment ID we passed as a parameter earlier to set the text
        //of that object to the "new text"
    }
}


//declare a new async function called "delete comment", using the comment ID as the parameter.
async function deleteComment(commentId) {
    const commentRef = doc(db, "comments", commentId);
    //declare a new variable called commentRef, set it to a document, then define the record the function should delete
    //in this instance we say its in the database, in the collection: "comments" and then we use the parameter of the comment ID
    await deleteDoc(commentRef);
    console.log("Comment deleted!");    
}


const commentButton = document.getElementById("login-to-comment-btn");
const commentText = document.getElementById("comment-text");

commentButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    const comment = commentText.value.trim(); // Get the comment text and trim extra spaces

    if (comment) {
        postComment(comment); // Pass the comment text to the postComment function
        commentText.value = ""; // Clear the input field after posting
    } else {
        console.log("Please write a comment before submitting.");
    }
});
