import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbUpdateName } from "./data/database.js";

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

  $("#js-settings-firstname").val(user.firstName);
  $("#js-settings-lastname").val(user.lastName);

  $("#js-settings-save-btn").on("click", () => {
    const userId = localStorage.getItem("loggedInUserId");
    const firstName = $("#js-settings-firstname").val();
    const lastName = $("#js-settings-lastname").val();

    dbUpdateName(userId, firstName, lastName);
  });
}
