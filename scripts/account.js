import { handleWindow } from "./utils/window.js";
import { getUser, dbLogout } from "./data/database.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

async function loadPage() {
  loadUser();
}

async function loadUser() {
  try {
    const user = await getUser();
    renderAccountHTML(user);
  } catch (error) {
    window.location.href = "login.html";
  }
}

function renderAccountHTML(user) {
  let accountHTML = ``;

  $("#js-account-name").html(user.firstName);

  $("#js-logout-btn").on("click", () => {
    dbLogout();
    window.location.href = "login.html";
  });
}
