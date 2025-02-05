import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  setDoc,
  updateDoc,
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

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export async function dbSignup(firstName, lastName, email, password) {
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
          console.log(error);
          showFormAlert("Something went wrong! Please try again");
        });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        showFormAlert("The email address is already in use!");
      } else {
        console.log(error);
        showFormAlert("Something went wrong! Please review fields.");
      }
    });
}

export function dbLogin(email, password) {
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
        console.log(error);
        showFormAlert("Something went wrong! Please try again.");
      }
    });
}

export function dbLogout() {
  localStorage.removeItem("loggedInUserId");

  signOut(auth)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(error);
      showFormAlert("Something went wrong! Please try again.");
    });
}

export async function dbGetUser() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);

    try {
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log(error);
        localStorage.removeItem("loggedInUserId");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function dbUpdateName(userId, firstName, lastName) {
  try {
    const usersRef = doc(db, "users", userId);

    await updateDoc(usersRef, {
      firstName: firstName,
      lastName: lastName,
    })
      .then(() => {
        window.location.href = "account.html";
      })
      .catch((error) => {
        console.log(error);
        showFormAlert("Something went wrong! Please try again.");
      });
  } catch (error) {
    console.error(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}

export async function dbUpdatePassword(oldpassword, newpassword) {
  const user = auth.currentUser;
  const credentials = EmailAuthProvider.credential(user.email, oldpassword);

  reauthenticateWithCredential(user, credentials)
    .then(() => {
      updatePassword(user, newpassword)
        .then(() => {
          window.location.href = "settings.html";
        })
        .catch((error) => {
          console.log(error);
          showFormAlert("Something went wrong! Please try again.");
        });
    })
    .catch((error) => {
      if (error.code === "auth/invalid-credential") {
        console.log(error);
        showFormAlert("The old password is incorrect!");

        $("#js-settings-password-old").addClass("invalid-field");
      } else {
        console.log(error);
        showFormAlert("Something went wrong! Please try again.");
      }
    });
}

export function sendPasswordEmail(email) {
  checkIfEmailExists(email)
    .then((exists) => {
      if (exists) {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            console.log("Password reset email sent");
            window.location.href = "login.html";
          })
          .catch((error) => {
            console.error(error);
            showFormAlert("Something went wrong! Please try again.");
          });
      } else {
        $("#js-modal-login-email").addClass("invalid-field");
        showFormAlert("Email address does not exist!");
      }
    })
    .catch((error) => {
      console.log(error);
      showFormAlert("Something went wrong! Please try again.");
    });
}

async function checkIfEmailExists(email) {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    if (signInMethods.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
