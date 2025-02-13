import cart from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { showFormAlert } from "../utils/form.js";
import { addOrder } from "../data/orders.js";
import { getConcert } from "../data/concerts.js";

export function renderPaymentSummaryHTML() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((item) => {
    if (item.category === "S") {
      const product = getProduct(item.productId);
      productPriceCents += product.priceCents * item.quantity;
    } else if (item.category === "T") {
      const concert = getConcert(item.productId);
      productPriceCents += concert.ticketPrice[item.type] * item.quantity;
    }

    const deliveryOption = getDeliveryOption(item.deliveryId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalAfterTaxCents = totalBeforeTaxCents + taxCents;

  let orderSummaryHTML = `  
    <h3>Order Summary</h3>

    <div class="order-pricing">
      <div>
        <p>Items (<span>${cart.calculateCartQuantity()}</span>):</p>
        <p>$${formatCurrency(totalBeforeTaxCents)}</p>
      </div>
      <div>
        <p>Shipping & handling:</p>
        <p>$${formatCurrency(shippingPriceCents)}</p>
      </div>
      <div>
        <p>Estimated tax:</p>
        <p>$${formatCurrency(taxCents)}</p>
      </div>
    </div>

    <div class="order-total">
      <h3>Order total:</h3>
      <h3>$${formatCurrency(totalAfterTaxCents)}</h3>
    </div>

    <div class="checkout-submit-btn-container">
      <div class="db-alert js-db-alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p class="js-db-alert-message">error!</p>
      </div>
      <button class="checkout-submit-btn" id="js-checkout-submit-btn">
        Place order
      </button>
    </div>   
  `;

  $("#js-order-summary").html(orderSummaryHTML);

  $("#js-checkout-submit-btn").on("click", () => {
    submitOrder();
  });
}

async function submitOrder() {
  if (cart.cartItems.length <= 0) {
    showFormAlert("Error! Cart is empty.");
    return;
  }

  const addressId = $("#js-method-address").data("addressId");
  const paymentId = $("#js-method-payment").data("paymentId");
  if (!addressId) {
    showFormAlert("Please provide an address!");
    return;
  }
  if (!paymentId) {
    showFormAlert("Please provide a payment!");
    return;
  }

  addOrder(cart.cartItems);
  cart.emptyCart();
  window.location.href = `orders.html`;
}
