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
  serverTimestamp,
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
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showFormAlert } from "../utils/form.js";

const firebaseConfig = {
  apiKey: "AIzaSyANEmzsZ9GTVjrOCOMFSkw_OsPfcATDQL0",
  authDomain: "reach-worship-23551.firebaseapp.com",
  databaseURL: "https://reach-worship-23551-default-rtdb.firebaseio.com",
  projectId: "reach-worship-23551",
  storageBucket: "reach-worship-23551.firebasestorage.app",
  messagingSenderId: "353132613915",
  approductId: "1:353132613915:web:3fff201b98bbd721c9c3be",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

/** USER **/
export async function dbSignup(firstName, lastName, email, phone, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      defaultAddressId: "",
      defaultPaymentId: "",
    };
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, userData);

    $("#js-success-modal").addClass("active");
    $("#js-modal-overlay").addClass("active");
  } catch (error) {
    console.log(error);

    if (error.code === "auth/email-already-in-use") {
      showFormAlert("The email address is already in use!");
    } else {
      showFormAlert("Something went wrong! Please review fields.");
    }
  }
}
export async function dbLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    localStorage.setItem("loggedInUserId", user.uid);

    window.location.href = "account.html";
  } catch (error) {
    console.log(error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      showFormAlert("The email or password is incorrect!");
    } else {
      showFormAlert("Something went wrong! Please try again.");
    }
  }
}
export async function dbLogout() {
  try {
    await signOut(auth);
    localStorage.removeItem("loggedInUserId");

    $("#js-success-modal").addClass("active");
    $("#js-modal-overlay").addClass("active");
  } catch (error) {
    console.log(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}
export async function dbGetUser() {
  const uid = localStorage.getItem("loggedInUserId");

  if (uid) {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists() && auth.currentUser) {
      return userDoc.data();
    } else {
      localStorage.removeItem("loggedInUserId");
      throw new Error("no user found");
    }
  } else {
    await signOut(auth);
    throw new Error("no user found");
  }
}
export async function dbUpdateUserInfo(firstName, lastName, phone) {
  try {
    const userId = localStorage.getItem("loggedInUserId");

    const userData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    };
    const usersRef = doc(db, "users", userId);
    await updateDoc(usersRef, userData);

    $("#js-success-modal").addClass("active");
    $("#js-modal-overlay").addClass("active");
  } catch (error) {
    console.error(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}
export async function dbUpdatePassword(oldpassword, newpassword) {
  try {
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user.email, oldpassword);

    await reauthenticateWithCredential(user, credentials);
    await updatePassword(user, newpassword);

    $("#js-success-modal").addClass("active");
    $("#js-modal-overlay").addClass("active");
  } catch (error) {
    console.log(error);

    if (error.code === "auth/wrong-password") {
      showFormAlert("The old password is incorrect!");
      $("#js-settings-password-old").addClass("invalid-field");
    } else {
      showFormAlert("Something went wrong! Please try again.");
    }
  }
}
export async function dbSendPasswordEmail(email) {
  try {
    const emailExists = await dbCheckIfEmailExists(email);

    if (emailExists) {
      await sendPasswordResetEmail(auth, email);

      $("#js-login-modal").removeClass("active");
      $("#js-success-modal").addClass("active");
    } else {
      $("#js-modal-login-email").addClass("invalid-field");
      showFormAlert("Email address does not exist!");
    }
  } catch (error) {
    console.log(error);

    if (error.code === "auth/invalid-email") {
      showFormAlert("The email address is not valid!");
    } else {
      showFormAlert("Something went wrong! Please try again.");
    }
  }
}

async function dbCheckIfEmailExists(email) {
  const emailAccounts = await fetchSignInMethodsForEmail(auth, email);

  if (emailAccounts.length > 0) {
    return true;
  } else {
    console.log("email was not found in users auth db");
    return false;
  }
}
/** END USER **/

/** ADDRESS **/
export async function dbAddAddress(addressInfo, isDefault) {
  try {
    const userId = auth.currentUser.uid;
    const addressData = {
      userId: userId,
      createdAt: serverTimestamp(),
      ...addressInfo,
    };
    const addressesRef = collection(db, "addresses");
    const docRef = await addDoc(addressesRef, addressData);

    isDefault && dbSetDefaultAddress(docRef.id);

    $("#js-address-modal").removeClass("active");
    $("#js-success-modal").addClass("active");
  } catch (error) {
    console.log(error);
    showFormAlert("Something went wrong! Please try again");
  }
}
export async function dbUpdateAddress(addressId, addressInfo, isDefault) {
  try {
    const addressRef = doc(db, "addresses", addressId);
    const addressDoc = await getDoc(addressRef);

    if (addressDoc.exists()) {
      const userId = auth.currentUser.uid;
      const createdAt = addressDoc.data().createdAt;
      const addressData = {
        userId: userId,
        createdAt: createdAt,
        ...addressInfo,
      };

      await updateDoc(addressRef, addressData);

      // SET DEFAULT IF CHECKED
      // REMOVE DEFAULT IF UNCHECKED FROM CHECKED
      if (isDefault) {
        await dbSetDefaultAddress(addressDoc.id);
      } else if ((await dbGetDefaultAddress()) === addressDoc.id) {
        await dbSetDefaultAddress("");
      }

      $("#js-address-modal").removeClass("active");
      $("#js-success-modal").addClass("active");
    } else {
      console.log("reference to address was not established");
      showFormAlert("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}
export async function dbGetAddressById(addressId) {
  const addressRef = doc(db, "addresses", addressId);
  const addressDoc = await getDoc(addressRef);

  if (addressDoc.exists()) {
    return addressDoc.data();
  } else {
    throw new Error("reference to address was not established");
  }
}
export async function dbGetUserAddresses() {
  const addressesRef = collection(db, "addresses");
  const userId = auth.currentUser.uid;
  const q = query(
    addressesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);

  const addresses = [];
  querySnapshot.forEach((address) => {
    addresses.push({
      aid: address.id,
      ...address.data(),
    });
  });

  return addresses;
}
export async function dbGetDefaultAddress() {
  const userId = auth.currentUser.uid;
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const addressId = userDoc.data().defaultAddressId;
    return addressId;
  } else {
    console.log("user was not found in db");
  }
}
export async function dbSetDefaultAddress(addressId) {
  try {
    const userId = auth.currentUser.uid;
    const userData = {
      defaultAddressId: addressId,
    };
    const usersRef = doc(db, "users", userId);
    await updateDoc(usersRef, userData);
  } catch (error) {
    console.error(error);
  }
}
export async function dbRemoveAddress(addressId) {
  try {
    const addressRef = doc(db, "addresses", addressId);

    (await dbGetDefaultAddress()) === addressId && dbSetDefaultAddress("");
    await deleteDoc(addressRef);
  } catch (error) {
    console.log(error);
  }
}
/** END ADDRESS **/

/** PAYMENT **/
export async function dbAddPayment(paymentInfo, isDefault) {
  try {
    const userId = auth.currentUser.uid;
    const paymentData = {
      userId: userId,
      createdAt: serverTimestamp(),
      ...paymentInfo,
    };
    const paymentRef = collection(db, "payments");
    const docRef = await addDoc(paymentRef, paymentData);

    isDefault && dbSetDefaultPayment(docRef.id);

    $("#js-payment-modal").removeClass("active");
    $("#js-success-modal").addClass("active");
  } catch (error) {
    console.log(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}
export async function dbUpdatePayment(paymentId, paymentInfo, isDefault) {
  try {
    const paymentRef = doc(db, "payments", paymentId);
    const paymentDoc = await getDoc(paymentRef);

    if (paymentDoc.exists()) {
      const userId = auth.currentUser.uid;
      const createdAt = paymentDoc.data().createdAt;
      const paymentData = {
        userId: userId,
        createdAt: createdAt,
        ...paymentInfo,
      };

      await updateDoc(paymentRef, paymentData);

      // SET DEFAULT IF CHECKED
      // REMOVE DEFAULT IF UNCHECKED FROM CHECKED
      if (isDefault) {
        await dbSetDefaultPayment(paymentDoc.id);
      } else if ((await dbGetDefaultPayment()) === paymentDoc.id) {
        await dbSetDefaultPayment("");
      }

      $("#js-payment-modal").removeClass("active");
      $("#js-success-modal").addClass("active");
    } else {
      console.log("reference to payment was not established");
      showFormAlert("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error(error);
    showFormAlert("Something went wrong! Please try again.");
  }
}
export async function dbGetPaymentById(paymentId) {
  const paymentRef = doc(db, "payments", paymentId);
  const paymentDoc = await getDoc(paymentRef);

  if (paymentDoc.exists()) {
    return paymentDoc.data();
  } else {
    throw new Error("reference to payment was not established");
  }
}
export async function dbGetUserPayments() {
  const paymentRef = collection(db, "payments");
  const userId = auth.currentUser.uid;
  const q = query(
    paymentRef,
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);

  const payments = [];
  querySnapshot.forEach((payment) => {
    payments.push({
      productId: payment.id,
      ...payment.data(),
    });
  });

  return payments;
}
export async function dbGetDefaultPayment() {
  const userId = auth.currentUser.uid;
  const docRef = doc(db, "users", userId);
  const userDoc = await getDoc(docRef);

  if (userDoc.exists()) {
    const paymentId = userDoc.data().defaultPaymentId;
    return paymentId;
  } else {
    console.log("user was not found in db");
  }
}
export async function dbSetDefaultPayment(paymentId) {
  try {
    const userId = auth.currentUser.uid;
    const userData = {
      defaultPaymentId: paymentId,
    };
    const usersRef = doc(db, "users", userId);
    await updateDoc(usersRef, userData);
  } catch (error) {
    console.error(error);
  }
}
export async function dbRemovePayment(paymentId) {
  try {
    const paymentRef = doc(db, "payments", paymentId);

    (await dbGetDefaultPayment()) === paymentId && dbSetDefaultPayment("");
    await deleteDoc(paymentRef);
  } catch (error) {
    console.log(error);
  }
}
/** END PAYMENT **/
