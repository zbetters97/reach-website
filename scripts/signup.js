import { handleWindow } from "./utils/window.js";
import { dbSignup } from "./data/database.js";
import {
  checkEmptyInput,
  disableNonNumericInput,
  formatPhoneNumber,
  isEmailValid,
  isPasswordValid,
  isPhoneValid,
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

  const phone = $("#js-signup-phone");
  phone.on("keydown", disableNonNumericInput);
  phone.on("keyup", formatPhoneNumber);

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

    if (!isValid) return;

    const firstName = $("#js-signup-firstname");
    const lastName = $("#js-signup-lastname");
    const email = $("#js-signup-email");
    const phone = $("#js-signup-phone");
    const password = $("#js-signup-password");
    const repassword = $("#js-signup-repassword");

    if (!isEmailValid(email.val())) {
      email.addClass("invalid-field");
      showFormAlert("The email address is not valid!");

      return;
    }

    if (!isPhoneValid(phone.val())) {
      phone.addClass("invalid-field");
      showFormAlert("The phone number is not valid!");

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
      phone.val(),
      password.val()
    );
  });
}
