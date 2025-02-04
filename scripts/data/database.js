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

export async function dbSignup(firstName, lastName, email, password) {
  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.log("error!", error);
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
      localStorage.setItem("loggedInUserId", user.uid);

      window.location.href = "account.html";
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
  const auth = getAuth();

  localStorage.removeItem("loggedInUserId");

  signOut(auth)
    .then(() => {
      return;
    })
    .catch(() => {
      showFormAlert("Something went wrong! Please try again.");
    });
}

export async function getUser() {
  const db = getFirestore();

  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);

    try {
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("Error! User does not exist.");
      }
    } catch (error) {
      console.log("error!", error);
    }
  } else {
    console.log("Error! User ID not found in local storage.");
  }
}
