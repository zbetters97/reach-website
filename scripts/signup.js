import { handleWindow } from "./utils/window.js";

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

  $("#js-signup-form").submit(function () {
    let isValid = true;

    $(this)
      .find(":input:not(:button)")
      .each(function () {
        checkEmptyInput($(this));

        $(this).val() === "" && (isValid = false);
      });

    const email = $("#js-signup-email");
    const password = $("#js-signup-password");
    const repassword = $("#js-signup-repassword");

    if (!~email.val().indexOf("@")) {
      email.addClass("invalid-field");
      isValid = false;
    }

    if (password.val().length < 8) {
      password.addClass("invalid-field");
      isValid = false;
    }

    if (password.val() !== repassword.val()) {
      password.addClass("invalid-field");
      repassword.addClass("invalid-field");
      isValid = false;
    }

    return isValid;
  });
}

function checkEmptyInput(field) {
  !field.val()
    ? field.addClass("invalid-field")
    : field.removeClass("invalid-field");
}
