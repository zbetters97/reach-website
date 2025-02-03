import { handleWindow } from "./utils/window.js";
import { dbSignup } from "./data/database.js";
import {
  checkEmptyInput,
  isEmailValid,
  isPasswordValid,
  showFormAlert,
} from "./utils/form.js";

$(document).ready(function () {
  handleWindow();
  handleSignup();
});

function handleSignup() {
  $("#js-signup-form :input:not(:button)").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  $("#js-signup-form").submit(function (event) {
    event.preventDefault();

    let isValid = true;

    $(this)
      .find(":input:not(:button)")
      .each(function () {
        checkEmptyInput($(this));
        if (!$(this).val()) {
          isValid = false;
          showFormAlert("Please fill out all fields!");
        }
      });

    const firstName = $("#js-signup-firstname");
    const lastName = $("#js-signup-lastname");
    const email = $("#js-signup-email");
    const username = $("#js-signup-username");
    const password = $("#js-signup-password");
    const repassword = $("#js-signup-repassword");

    if (!isValid) return;

    if (!isEmailValid(email.val())) {
      email.addClass("invalid-field");
      showFormAlert("The email address is not valid!");

      return;
    }

    if (!isPasswordValid(password.val())) {
      password.addClass("invalid-field");
      showFormAlert("The password must be at least 8 characters!");

      return;
    }

    if (password.val() !== repassword.val()) {
      password.addClass("invalid-field");
      repassword.addClass("invalid-field");

      showFormAlert("The passwords do not match!");

      return;
    }

    dbSignup(
      firstName.val(),
      lastName.val(),
      email.val(),
      username.val(),
      password.val()
    );
  });
}
