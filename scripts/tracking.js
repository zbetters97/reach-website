import { dbGetOrderById, dbGetUser } from "./data/database.js";
import { showLoginErrorModal } from "./utils/form.js";
import { handleWindow } from "./utils/window.js";
import { getProduct, loadProducts } from "./data/products.js";
import { formatDateDMD } from "./utils/date.js";
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
    await renderTrackingPage();
  } catch {
    showLoginErrorModal();
  }
}

async function renderTrackingPage() {
  let trackingHTML = ``;

  try {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("orderId");
    const productId = url.searchParams.get("productId");

    $("#js-account-nav-tracking").on("click", () => {
      window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
    });

    const order = await dbGetOrderById(orderId);

    const product = getProduct(productId);
    const orderProduct = getOrderProduct(order, productId);
    const date = formatDateDMD(orderProduct.deliveryDate.toDate());
    const image = product.changeColor(product.color);

    const daysRemaining = getDeliveryDaysRemaining(
      orderProduct.deliveryDate.toDate()
    );

    trackingHTML = `
      <div class="tracking-product-container">
        <h3 class="tracking-date">
        
          ${
            daysRemaining > 0
              ? `Arriving <span>${date}</span>`
              : `Delivered on ${date}`
          }
        
        </h3>
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
    `;

    $("#js-tracking-container").html(trackingHTML);

    setTimeout(() => {
      renderProgressBar(orderProduct.deliveryDate.toDate()), 1000;
    });
  } catch (error) {
    console.log(error);
    renderEmptyHTML();
  }
}

function renderEmptyHTML() {
  let trackingHTML = `    
    <div class="tracking-empty-container">
      <h3>No item found for tracking!</h3>
      <button class="back-btn tracking-empty-btn" onclick="window.location.href='orders.html'">
        Go back
      </button>
    </div>    
  `;

  $("#js-tracking-container").html(trackingHTML);
}

function getOrderProduct(order, productId) {
  const index = order.items.findIndex((item) => {
    return item.productId == productId;
  });

  const orderProduct = order.items[index];

  return orderProduct;
}

function renderProgressBar(deliveryDate) {
  const trackingBar = $("#js-tracking-bar");

  const daysRemaining = getDeliveryDaysRemaining(deliveryDate);

  if (daysRemaining > 3) {
    $("#js-tracking-preparing").addClass("tracking-current-status");
    trackingBar.css("width", "10%");
  } else if (3 >= daysRemaining && daysRemaining > 0) {
    $("#js-tracking-shipped").addClass("tracking-current-status");
    trackingBar.css("width", "50%");
  } else {
    $("#js-tracking-delivered").addClass("tracking-current-status");
    trackingBar.css("width", "100%");
  }
}
