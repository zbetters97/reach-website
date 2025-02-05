import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbUpdateName } from "./data/database.js";
import { checkEmptyForm, showFormAlert } from "./utils/form.js";

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
  } catch (error) {
    window.location.href = "login.html";
  }
}

async function renderSettingsHTML(user) {
  $("#js-settings-email").val(user.email);

  const firstNameField = $("#js-settings-firstname");
  const lastNameField = $("#js-settings-lastname");

  firstNameField.val(user.firstName);
  lastNameField.val(user.lastName);

  $("#js-settings-form :input").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  $("#js-settings-form").submit(function (event) {
    event.preventDefault();

    const userId = localStorage.getItem("loggedInUserId");
    !userId && (window.location.href = "login.html");

    checkEmptyForm($(this));

    const firstName = firstNameField.val();
    const lastName = lastNameField.val();

    if (!!firstName && !!lastName) {
      dbUpdateName(userId, firstName, lastName);
    } else {
      showFormAlert("Please fill out all fields!");
    }
  });
}
