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
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showFormAlert } from "../utils/form.js";

const firebaseConfig = {
  apiKey: "AIzaSyANEmzsZ9GTVjrOCOMFSkw_OsPfcATDQL0",
  authDomain: "reach-worship-23551.firebaseapp.com",
  databaseURL: "https://reach-worship-23551-default-rtdb.firebaseio.com",
  projectId: "reach-worship-23551",
  storageBucket: "reach-worship-23551.firebasestorage.app",
  messagingSenderId: "353132613915",
  appId: "1:353132613915:web:3fff201b98bbd721c9c3be",
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export async function dbSignup(firstName, lastName, email, phone, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      };
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          $("#js-signup-success-modal").addClass("active");
          $("#js-signup-success-overlay").addClass("active");
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
      $("#js-logout-success-modal").addClass("active");
      $("#js-logout-success-overlay").addClass("active");
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
        localStorage.removeItem("loggedInUserId");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function dbUpdateUserInfo(firstName, lastName, phone) {
  try {
    const userId = auth.currentUser.uid;
    const userData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    };

    const usersRef = doc(db, "users", userId);
    await updateDoc(usersRef, userData)
      .then(() => {
        $("#js-settings-success-modal").addClass("active");
        $("#js-settings-success-overlay").addClass("active");
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
          $("#js-password-success-modal").addClass("active");
          $("#js-password-success-overlay").addClass("active");
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

export function dbSendPasswordEmail(email) {
  dbCheckIfEmailExists(email)
    .then((exists) => {
      if (exists) {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            $("#js-login-overlay").removeClass("active");
            $("#js-login-modal").removeClass("active");
            $("#js-reset-success-overlay").addClass("active");
            $("#js-reset-success-modal").addClass("active");
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

async function dbCheckIfEmailExists(email) {
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

export async function dbAddAddress(
  fullName,
  phone,
  addressOne,
  addressTwo,
  city,
  state,
  zip
) {
  const userId = auth.currentUser.uid;
  const addressData = {
    userId: userId,
    fullName: fullName,
    phone: phone,
    addressOne: addressOne,
    addressTwo: addressTwo,
    city: city,
    state: state,
    zip: zip,
  };

  try {
    const addressesRef = collection(db, "addresses");
    addDoc(addressesRef, addressData)
      .then((ref) => {
        $("#js-address-overlay").removeClass("active");
        $("#js-address-modal").removeClass("active");
        $("#js-address-success-overlay").addClass("active");
        $("#js-address-success-modal").addClass("active");
        console.log(ref);
      })
      .catch((error) => {
        console.log(error);
        showFormAlert("Something went wrong! Please try again");
      });
  } catch (error) {
    console.log(error);
    showFormAlert("Something went wrong! Please try again");
  }
}

export async function dbUpdateAddress(
  addressId,
  fullName,
  phone,
  addressOne,
  addressTwo,
  city,
  state,
  zip
) {
  try {
    const userId = auth.currentUser.uid;
    const addressData = {
      userId: userId,
      fullName: fullName,
      phone: phone,
      addressOne: addressOne,
      addressTwo: addressTwo,
      city: city,
      state: state,
      zip: zip,
    };

    const addressesRef = doc(db, "addresses", addressId);
    await updateDoc(addressesRef, addressData)
      .then(() => {
        $("#js-address-overlay").removeClass("active");
        $("#js-address-modal").removeClass("active");
        $("#js-address-success-overlay").addClass("active");
        $("#js-address-success-modal").addClass("active");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error(error);
  }
}

export async function dbGetAddresses() {
  try {
    const uid = localStorage.getItem("loggedInUserId");

    if (uid) {
      const addresses = [];

      const addressesRef = collection(db, "addresses");
      const q = query(addressesRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((address) => {
        addresses.push({
          aId: address.id,
          ...address.data(),
        });
      });

      return addresses;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function dbGetAddress(aId) {
  try {
    const addressRef = doc(db, "addresses", aId);
    const snapshot = await getDoc(addressRef);

    if (snapshot.exists()) {
      const address = snapshot.data();
      return address;
    } else {
      console.log("error!");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function dbRemoveAddress(aId) {
  try {
    const addressRef = doc(db, "addresses", aId);
    await deleteDoc(addressRef);
  } catch (error) {
    console.log(error);
  }
}
