import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbLogin } from "./data/database.js";
import { isEmailValid, showFormAlert } from "./utils/form.js";

$(document).ready(function () {
  handleWindow();
  checkLoggedInUser();
  handleLogin();
});

async function checkLoggedInUser() {
  try {
    const user = await dbGetUser();
    if (user) {
      window.location.href = "account.html";
    }
  } catch (error) {
    return;
  }
}

function handleLogin() {
  $("#js-login-form :input").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  $("#js-login-form").submit(function (event) {
    event.preventDefault();

    checkEmptyForm($(this));

    const email = $("#js-login-email");
    const password = $("#js-login-password");

    if (!!email.val() && !!password.val()) {
      if (!isEmailValid(email.val())) {
        email.addClass("invalid-field");
        showFormAlert("The email address is not valid!");
      } else {
        dbLogin(email.val(), password.val());
      }
    } else {
      showFormAlert("Please enter your username and password!");
    }
  });
}

function checkEmptyForm(form) {
  form.find(":input:not(:button)").each(function () {
    !$(this).val()
      ? $(this).addClass("invalid-field")
      : $(this).removeClass("invalid-field");
  });
}
