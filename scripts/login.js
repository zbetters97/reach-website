import { handleWindow } from "./utils/window.js";

$(document).ready(function () {
  handleWindow();
  handleLogin();
});

function handleLogin() {
  $("#js-login-form :input").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  $("#js-login-form").submit(function () {
    checkEmptyForm($(this));

    const username = $("#js-login-username");
    const password = $("#js-login-password");

    return !!username.val() && !!password.val();
  });
}

function checkEmptyForm(form) {
  form.find(":input:not(:button)").each(function () {
    !$(this).val()
      ? $(this).addClass("invalid-field")
      : $(this).removeClass("invalid-field");
  });
}
