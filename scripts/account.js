import { handleWindow } from "./utils/window.js";
import { dbGetUser, dbLogout } from "./data/database.js";
import { showLoginErrorModal } from "./utils/form.js";

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
  } catch {
    showLoginErrorModal();
  }
}

function renderAccountHTML(user) {
  $("#js-account-name").html(`Welcome back, ${user.firstName}!`);
  $("#js-account-name").css("opacity", 1);

  $("#js-logout-btn").on("click", () => {
    dbLogout();
  });
}
