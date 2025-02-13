import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbUpdateUserInfo } from "./data/database.js";
import {
  checkEmptyForm,
  disableNonNumericInput,
  formatPhoneNumber,
  isPhoneValid,
  showFormAlert,
  showLoginErrorModal,
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
    const user = await dbGetUser();
    renderSettingsHTML(user);
  } catch {
    showLoginErrorModal();
  }
}

async function renderSettingsHTML(user) {
  $("#js-settings-email").val(user.email);

  const firstNameField = $("#js-settings-firstname");
  const lastNameField = $("#js-settings-lastname");
  const phoneField = $("#js-settings-phone");

  firstNameField.val(user.firstName);
  lastNameField.val(user.lastName);
  phoneField.val(user.phone);

  $("#js-settings-form :input").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  phoneField.on("keydown", disableNonNumericInput);
  phoneField.on("keyup", formatPhoneNumber);

  $("#js-settings-form").submit(function (event) {
    event.preventDefault();

    checkEmptyForm($(this));

    const firstName = firstNameField.val();
    const lastName = lastNameField.val();
    const phone = phoneField.val();

    if (!firstName || !lastName || !phone) {
      showFormAlert("Please fill out all fields!");
      return;
    }

    if (!isPhoneValid(phone)) {
      phoneField.addClass("invalid-field");
      showFormAlert("The phone number is not valid!");

      return;
    }

    dbUpdateUserInfo(firstName, lastName, phone);
  });
}
