import { dbGetUser } from "./data/database.js";
import { orders } from "./data/orders.js";
import { showLoginErrorModal } from "./utils/form.js";
import { handleWindow } from "./utils/window.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  loadUser();
}

async function loadUser() {
  try {
    await dbGetUser();
    renderOrderPage();
  } catch {
    showLoginErrorModal();
  }
}

function renderOrderPage() {
  orders.forEach((order) => {
    order.forEach((item) => {
      console.log(item);
    });
  });
}
