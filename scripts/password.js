import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbUpdatePassword } from "./data/database.js";
import {
  checkEmptyForm,
  isPasswordValid,
  showFormAlert,
} from "./utils/form.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  loadUser();
}

async function loadUser() {
  try {
    await dbGetUser();
    changePassword();
  } catch (error) {
    console.log(error);
    // window.location.href = "login.html";
  }
}

async function changePassword() {
  $("#js-password-form :input").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  $("#js-password-form").submit(function (event) {
    event.preventDefault();

    checkEmptyForm($(this));

    const oldPassword = $("#js-settings-password-old");
    const newPassword = $("#js-settings-password-new");
    const newRePassword = $("#js-settings-repassword-new");

    if (!oldPassword.val() || !newPassword.val() || !newRePassword.val()) {
      showFormAlert("Please fill out all fields!");
      return;
    }
    if (newPassword.val() !== newRePassword.val()) {
      newPassword.addClass("invalid-field");
      newRePassword.addClass("invalid-field");
      showFormAlert("New passwords must match!");
      return;
    }
    if (!isPasswordValid(newPassword.val())) {
      newPassword.addClass("invalid-field");
      showFormAlert("New password must be at least 8 characters!");
      return;
    }
    if (oldPassword.val() === newPassword.val()) {
      newPassword.addClass("invalid-field");
      showFormAlert("New password must be a different password!");
      return;
    }

    dbUpdatePassword(oldPassword.val(), newPassword.val());
  });
}
