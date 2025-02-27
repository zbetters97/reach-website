import { dbGetUser, dbGetUserOrders } from "./data/database.js";
import { showLoginErrorModal } from "./utils/form.js";
import { handleWindow } from "./utils/window.js";
import formatCurrency from "./utils/money.js";
import { formatDateMDYLong, formatDateDMD, formatTime } from "./utils/date.js";
import { getProduct, loadProducts } from "./data/products.js";
import { getConcert } from "./data/concerts.js";

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
    await renderOrderPage();
  } catch (error) {
    console.log(error);
    showLoginErrorModal();
  }
}

async function renderOrderPage() {
  let ordersHTML = ``;

  try {
    const orders = await dbGetUserOrders();

    if (orders.length <= 0) {
      ordersHTML = `
        <div class="orders-empty-container">
          <h3>You have no submitted orders!</h3>
          <button class="forward-btn orders-empty-btn" onclick="window.location.href='shop.html'">
            Go to shop
          </button>
        </div>
      `;
    }

    orders.forEach((order) => {
      const orderId = order.orderId;
      const total = formatCurrency(order.totalInCents);
      const date = formatDateMDYLong(order.createdAt.toDate());

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-date">
              <h3>Order Placed:</h3>
              <p>${date}</p>
            </div>
            <div class="order-header-total">
              <h3>Total:</h3>
              <p>$${total}</p>
            </div>
            <div class="order-header-id">
              <h3>Order ID:</h3>
              <p>${orderId}</p>
            </div>
          </div>
      `;

      let itemsHTML = ``;
      order.items.forEach((item) => {
        if (item.category === "S") {
          const product = getProduct(item.productId);
          const image = product.changeColor(item.color);
          const date = formatDateDMD(item.deliveryDate.toDate());

          itemsHTML += `    
          <div class="order-products-container">
            <div class="order-product-card" 
              data-order-id=${orderId} data-product-id=${product.productId}>
              <img
                class="order-product-img"
                src="${image}"
              />
              <div class="order-product-details">
                <h3>${product.name}, ${item.type}</h3>
                <p>Arriving on: <span>${date}</span></p>
                <p>Quantity: <span>${item.quantity}</span></p>
              </div>
              <a 
                class="forward-btn order-track-btn"
                href="tracking.html?orderId=${orderId}&productId=${product.productId}"
              >
                Track package
              </a>
            </div>
          </div>
        `;
        } else if (item.category === "T") {
          const concert = getConcert(item.productId);
          const location = `${concert.city}, ${concert.state}`;
          const date = formatDateMDYLong(concert.date);
          const time = formatTime(concert.time);

          itemsHTML += `    
          <div class="order-products-container">
            <div class="order-product-card">
              <img
                class="order-product-img"
                src="images/home/home-tour.png"
              />
              <div class="order-product-details">
                <h3>${concert.venue}</h3>
                <p>${location}</p>
                <p>${date} @ ${time}</p>
                <p>Type: ${item.type}</p>
                <p>Quantity: <span>${item.quantity}</span></p>
              </div>
              <button class="forward-btn order-track-btn">View ticket</button>
            </div>
          </div>
        `;
        }
      });

      ordersHTML += `${itemsHTML} </div>`;
    });

    $("#js-orders-container").html(ordersHTML);
    handleTracking();
  } catch (error) {
    console.log(error);
  }
}

function handleTracking() {
  $(".order-products-container")
    .children()
    .on("click", function () {
      const orderId = $(this).data("order-id");
      const productId = $(this).data("product-id");

      window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
    });
}
