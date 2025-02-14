import { dbGetUser } from "./data/database.js";
import { showLoginErrorModal } from "./utils/form.js";
import { handleWindow } from "./utils/window.js";
import { getProduct, loadProducts } from "./data/products.js";
import { getOrder, getOrderProduct } from "./data/orders.js";
import { formatDateDMY } from "./utils/date.js";
import { getDeliveryDaysRemaining } from "./data/deliveryOptions.js";

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
    loadProducts();
    renderTrackingPage();
  } catch {
    showLoginErrorModal();
  }
}

function renderTrackingPage() {
  let trackingHTML = ``;

  try {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("orderId");
    const productId = url.searchParams.get("productId");

    const order = getOrder(orderId);
    const orderProduct = getOrderProduct(order, productId);
    const product = getProduct(productId);
    const date = formatDateDMY(orderProduct.deliveryDate);
    const image = product.changeColor(product.color);

    trackingHTML = `
      <div class="tracking-product-container">
        <h3>Arriving <span>${date}</span></h3>
        <div class="tracking-product">
          <h4>${product.name}, ${orderProduct.type}</h4>
          <p>Quantity: <span>${orderProduct.quantity}</span></p>

          <img
            class="tracking-product-img"
            src="${image}"
          />
        </div>
      </div>

      <div class="tracking-progress-container">
        <div class="tracking-labels-container">
          <div class="tracking-label" id="js-tracking-preparing">
            Preparing
          </div>
          <div class="tracking-label" id="js-tracking-shipped">
            Shipped
          </div>
          <div class="tracking-label" id="js-tracking-delivered">
            Delivered
          </div>
        </div>
        <div class="tracking-bar-container">
          <div class="tracking-bar" id="js-tracking-bar"></div>
        </div>
      </div>

      <button
        class="back-btn tracking-back-btn"
        onclick="window.location.href='orders.html'"
      >
        View all orders
      </button>
    `;

    $("#js-tracking-container").html(trackingHTML);

    setTimeout(function () {
      renderProgressBar(orderProduct.deliveryDate);
    }, 1000);
  } catch (error) {
    console.log(error);
    renderEmptyHTML();
  }
}

function renderEmptyHTML() {
  let trackingHTML = `    
    <div class="tracking-empty-container">
      <h3>No item found for tracking!</h3>
      <button class="back-btn">Go back</button>
    </div>    
  `;

  $("#js-tracking-container").html(trackingHTML);
}

function renderProgressBar(deliveryDate) {
  const trackingBar = $("#js-tracking-bar");

  const daysRemaining = getDeliveryDaysRemaining(deliveryDate);

  if (daysRemaining > 5) {
    $("#js-tracking-preparing").addClass("tracking-current-status");
    trackingBar.css("width", "10%");
  } else if (5 > daysRemaining && daysRemaining > 0) {
    $("#js-tracking-shipping").addClass("tracking-current-status");
    trackingBar.css("width", "50%");
  } else {
    $("#js-tracking-delivered").addClass("tracking-current-status");
    trackingBar.css("width", "100%");
  }
}
