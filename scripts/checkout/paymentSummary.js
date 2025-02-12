import cart from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";

export function renderPaymentSummaryHTML() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((item) => {
    const product = getProduct(item.pId);
    productPriceCents += product.priceCents * item.quantity;

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

    <button class="checkout-submit-btn">Place order</button>
  `;

  $("#js-order-summary").html(orderSummaryHTML);
}
