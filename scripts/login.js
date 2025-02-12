import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbLogin, dbSendPasswordEmail } from "./data/database.js";
import {
  checkEmptyForm,
  hideFormAlert,
  isEmailValid,
  showFormAlert,
} from "./utils/form.js";

const modal = $("#js-login-modal");

$(document).ready(function () {
  handleWindow();
  checkLoggedInUser();
  handleLogin();
  handleModal();
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

function handleModal() {
  $("#js-modal-overlay, #js-login-close-btn").on("click", () => {
    hideFormAlert();
    closeModal(modal);
  });

  $("#js-forgot-pw-link").on("click", (event) => {
    event.preventDefault();
    hideFormAlert();
    openModal(modal);
  });

  $("#js-modal-login-email").on("click", function () {
    $(this).removeClass("invalid-field");
  });

  $("#js-login-modal-btn").on("click", () => {
    const email = $("#js-modal-login-email");

    if (!email.val()) {
      email.addClass("invalid-field");
      showFormAlert("Please enter an email!");
      return;
    }

    if (!!email.val()) {
      if (!isEmailValid(email.val())) {
        email.addClass("invalid-field");
        showFormAlert("The email address is not valid!");
      } else {
        dbSendPasswordEmail(email.val());
      }
    } else {
      showFormAlert("Please enter an email!");
    }
  });
}

function openModal(modal) {
  if (modal != null) {
    modal.addClass("active");
    $("#js-modal-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $("#js-modal-overlay").removeClass("active");
  }
}
