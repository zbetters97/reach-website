import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showFormAlert } from "../utils/form.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJ01EvVbZGk9zvxSpkyZlI21oZxImnMzQ",
  authDomain: "reach-worship.firebaseapp.com",
  projectId: "reach-worship",
  storageBucket: "reach-worship.firebasestorage.app",
  messagingSenderId: "877552053114",
  appId: "1:877552053114:web:30f29b843b829c802904c3",
};

const app = initializeApp(firebaseConfig);

export function dbSignup(firstName, lastName, email, username, password) {
  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          console.log("created account!");
        })
        .catch((error) => {
          console.log("error 1!", error);
        });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showFormAlert("The email address is already in use!");
      } else {
        showFormAlert("Something went wrong! Please review fields.");
      }
    });
}

export function dbLogin(email, password) {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      console.log("user signed in!");
      localStorage.setItem("loggedInUserId", user.uid);
    })
    .catch((error) => {
      if (error.code === "auth/invalid-credential") {
        showFormAlert("The email or password is incorrect!");
      } else {
        showFormAlert("Something went wrong! Please try again.");
      }
    });
}

export function dbLogout() {
  $("#js-logout-btn").on("click", () => {
    const auth = getAuth();

    localStorage.removeItem("loggedInUserId");
    signOut(auth)
      .then(() => {
        console.log("signed out succesful");
      })
      .catch((error) => {
        showFormAlert("Something went wrong! Please try again.");
      });
  });
}

function getUser() {
  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, () => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);

      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("user found!", userData.firstName, userData.email);
          } else {
            console.log("no document found matching user!");
          }
        })
        .catch((error) => {
          console.log("error!", error);
        });
    } else {
      console.log("user ID not found in local storage!");
    }
  });
}
