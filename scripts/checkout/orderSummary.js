import cart from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getConcert } from "../data/concerts.js";
import formatCurrency from "../utils/money.js";
import {
  calculateDeliveryDate,
  deliveryOptions,
} from "../data/deliveryOptions.js";
import {
  formatDateMDYLong,
  formatTime,
  getCurrentDate,
} from "../utils/date.js";
import { renderPaymentSummaryHTML } from "./paymentSummary.js";

export function renderOrderSummaryHTML() {
  let shopItems = ``;
  let ticketItems = ``;

  cart.cartItems.forEach((item) => {
    const cId = item.cId;
    const quantity = item.quantity;
    const category = item.category;

    if (category === "S") {
      const product = getProduct(item.pId);
      const image = product.changeColor(item.color);

      shopItems += `
        <div class="product-details">
          <img class="product-image" src="${image}" />

          <div class="product-description">
            <h3>${product.name}</h3>
            <p class="product-price">$${product.getPrice()}</p>

            <p>Size: <span>${item.type}</span></p>
            <p>Color: <span>${item.color}</span></p>

            <div class="product-quantity" id="product-quantity-${cId}">
              <p>Quantity: <span id="js-checkout-item-quantity-${cId}">${quantity}</span></p>
              <a class="checkout-update-btn" data-cart-id=${cId}>
                Update
              </a>
              <input 
              class="quantity-input" 
              id="checkout-quantity-${cId}" 
              data-cart-id=${cId}
              type="number" min="0" max="99" 
              />
              <a class="checkout-save-btn" data-cart-id=${cId} >
                Save
              </a>
              <a class="checkout-delete-btn" data-cart-id=${cId}>
                Delete
              </a>
            </div>
          </div>

          <div class="product-delivery">
            ${deliveryOptionsHTML(item)}          
          </div>
        </div>      
    `;
    } else if (category === "T") {
      const concert = getConcert(item.pId);

      const venue = concert.venue;
      const location = `${concert.city}, ${concert.state}`;
      const date = formatDateMDYLong(concert.date);
      const time = formatTime(concert.time);

      const price = formatCurrency(concert.ticketPrice["STR"]);

      ticketItems += `
        <div class="product-details">
          <img
            class="product-image"
            src="images/home/home-tour.png"
          />
          <div class="product-description">
            <h3>${venue}</h3>
            <p>${location}</p>
            <p>${date} @ ${time}</p>
            <p class="product-price">$${price}</p>
            <p>Type: <span>${item.type}</span></p>

            <div class="product-quantity" id="product-quantity-${cId}">
              <p>Quantity: <span id="js-checkout-item-quantity-${cId}">
                ${item.quantity}
              </span></p>
              <a class="checkout-update-btn" data-cart-id=${cId}>
                Update
              </a>
              <input 
              class="quantity-input" 
              id="checkout-quantity-${cId}" 
              data-cart-id=${cId}
              type="number" min="0" max="10" 
              />
              <a class="checkout-save-btn" data-cart-id=${cId} >
                Save
              </a>
              <a class="checkout-delete-btn" data-cart-id=${cId}>
                Delete
              </a>
            </div>
          </div>
          

          <div class="product-delivery">
            <div class="delivery-option">
              <input type="radio" name="radio-option-${cId}" checked />
              <div class="delivery-date">
                <h4>${getCurrentDate()}</h4>
                <p>Free Email Delivery</p>
              </div>
            </div>
          </div>
        </div>      
      `;
    }
  });

  $("#js-product-details").html(shopItems);
  $("#js-ticket-details").html(ticketItems);

  $(".checkout-update-btn").each(function () {
    $(this).on("click", function () {
      const cId = $(this).data("cart-id");
      $(`#product-quantity-${cId}`).addClass("editing-quantity");
    });
  });

  $(".quantity-input").each(function () {
    $(this).on("keypress", function (event) {
      if (event.key == "Enter") {
        const cId = $(this).data("cart-id");
        updateItemQuantity(cId);
      }
    });
  });

  $(".checkout-save-btn").each(function () {
    $(this).on("click", function () {
      const cId = $(this).data("cart-id");
      updateItemQuantity(cId);
    });
  });

  $(".checkout-delete-btn").each(function () {
    $(this).on("click", function () {
      const cId = $(this).data("cart-id");
      cart.removeFromCart(cId);

      renderOrderSummaryHTML();
      renderPaymentSummaryHTML();
    });
  });

  $(".js-delivery-option").each(function () {
    $(this).on("click", function () {
      const { cartId, deliveryId } = $(this).data();
      cart.updateDeliveryOption(cartId, deliveryId);

      renderOrderSummaryHTML();
      renderPaymentSummaryHTML();
    });
  });
}

function deliveryOptionsHTML(item) {
  let deliveryOptionsHTML = ``;

  const cId = item.cId;

  deliveryOptions.forEach((deliveryOption) => {
    const deliveryId = deliveryOption.dId;

    const isChecked = deliveryId == item.deliveryId;

    const date = calculateDeliveryDate(deliveryOption);

    const price =
      deliveryOption.priceCents === 0
        ? "Free"
        : `$${formatCurrency(deliveryOption.priceCents)} - `;

    deliveryOptionsHTML += `  
      <div 
      class="delivery-option js-delivery-option" 
      data-cart-id=${cId}
      data-delivery-id=${deliveryId}>
        <input 
        type="radio" 
        name="radio-option-${cId}" 
        ${isChecked && "checked"} 
        />
        <div class="delivery-date">
          <h4>${date}</h4>
          <p>${price} Shipping</p>
        </div>
      </div>
    `;
  });

  return deliveryOptionsHTML;
}

function updateItemQuantity(cId) {
  const newQuantity = $(`#checkout-quantity-${cId}`) || null;

  if (cart.updateQuantity(cId, parseInt(newQuantity.val()))) {
    $(`#js-item-quantity-${cId}`).html(newQuantity.val());
    $(`#product-quantity-${cId}`).removeClass("editing-quantity");

    newQuantity.val("");

    renderOrderSummaryHTML();
    renderPaymentSummaryHTML();
  }
}
