import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

//Create function to post comment (and add the comment to firestore)
async function postComment(commentText) {
    const user = getAuth().currentUser;
    if(!user) {
        //alert user if they try to post a comment without being logged in (pretty sure im already handling this, but can never be too careful)
        alert('You must be logged in to post a comment');
        return;
    }

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
    //decalre a constant query that orders the comments by the time/date they were posted
    const q = query(commentsCollection, orderBy("timestamp", "asc"));

    //declare snapshot  to catch the new or changed comments
    onSnapshot(q, (querySnapshot) => {
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = '';
        // querySnapshot is used as a callback function to contain the updated comment list. Declare commentsList and then clear the list to prepare for the new data.

        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            const commentElement = document.createElement("div");
            commentElement.textContent = comment.text;
            // for each document returned by the snapshot, we retriev the data, store each comment as a document in firestore
            // then we declare the 'comment' variable and use it as an object to contain the data.
            // we then declare 'commentElement' variable then put the text property of the object into the div we create.


            //decalre variable 'currentUser', use firebase getAuth to get the user thats logged in
            const currentUser = getAuth().currentUser;
            if (currentUser && comment.userId === currentUser.uid) {
                //if the user that is currently logged in and the userId on the comments match, create edit and delete buttons for the comments that match.
                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("comment-buttons");
                editBtn.onclick = () => editComment(doc.id, comment.text);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("comment-buttons")
                deleteBtn.onclick = () => deleteComment(doc.id);
                
                //"append" the edit and delete buttons to the comment
                commentElement.appendChild(editBtn);
                commentElement.appendChild(deleteBtn);
            }

            //"append" the "commentElement" to the comments list.
            commentsList.appendChild(commentElement);
        })
    })
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
        alert("Please write a comment before submitting.");
    }
});
