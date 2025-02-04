import { handleWindow } from "./utils/window.js";
import { dbUpdatePassword } from "./data/database.js";

$(document).ready(function () {
  handleWindow();
});

function loadPage() {
  loadUser();
}

async function loadUser() {
  try {
    const user = await dbGetUser();
    changePassword(user);
  } catch (error) {
    window.location.href = "login.html";
  }
}

async function changePassword(user) {
  $("#js-password-save-btn").on("click", () => {
    const userId = localStorage.getItem("loggedInUserId");

    const oldPassword = $("#js-settings-password-old").val();
    const newPassword = $("#js-settings-password-new").val();
    const renewPassword = $("#js-settings-password-renew").val();

    dbUpdatePassword(userId, firstName, lastName);
  });
}
