import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbLogout } from "./data/database.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

async function loadPage() {
  loadUser();
}

async function loadUser() {
  try {
    const user = await dbGetUser();
    renderAccountHTML(user);
  } catch (error) {
    window.location.href = "login.html";
  }
}

function renderAccountHTML(user) {
  $("#js-account-name").html(user.firstName);

  $("#js-logout-btn").on("click", () => {
    dbLogout();
    window.location.href = "login.html";
  });
}
