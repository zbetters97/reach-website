import { handleWindow } from "./utils/window.js";
import { loadProducts } from "./data/products.js";
import { renderOrderSummaryHTML } from "./checkout/orderSummary.js";
import { renderPaymentSummaryHTML } from "./checkout/paymentSummary.js";
import { renderMethodsHTML } from "./checkout/orderMethods.js";
import { dbGetUser } from "./data/database.js";
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
    await dbGetUser();
    renderCheckout();
  } catch (error) {
    console.log(error);
    showLoginErrorModal();
  }
}
async function renderCheckout() {
  loadProducts();
  renderMethodsHTML();
  renderOrderSummaryHTML();
  renderPaymentSummaryHTML();
}
