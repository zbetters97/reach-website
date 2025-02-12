import {
  dbGetAddressById,
  dbGetDefaultAddress,
  dbGetDefaultPayment,
  dbGetPaymentById,
  dbGetUserAddresses,
  dbGetUserPayments,
} from "../data/database.js";
import { maskCardNumber } from "../utils/creditCard.js";

const addressModal = $("#js-checkout-address-modal");
const paymentModal = $("#js-checkout-payment-modal");

export function renderMethodsHTML() {
  renderAddressHTML();
  renderPaymentHTML();
}

async function renderAddressHTML(aId) {
  try {
    let addressId = aId || (await dbGetDefaultAddress());
    const address = await dbGetAddressById(addressId);

    let addressHTML = `  
      <div class="method-header">
        <h3>Delivering to <span>${address.fullName}</span></h3>
        <a id="js-address-change-btn">Change</a>
      </div>
      <p>${address.addressOne}</p>
      <p>${address.addressTwo}</p>
      <p>${address.city}, ${address.state} ${address.zip}</p>
    `;

    $("#js-checkout-address").html(addressHTML);

    $("#js-address-change-btn").on("click", () => {
      renderAddressModal();
    });
  } catch (error) {
    console.log(error);
  }
}

async function renderAddressModal() {
  try {
    let addressModalHTML = `
      <h2>Your Addresses</h2>
      <button class="checkout-modal-close-btn" id="js-checkout-address-close-btn">
        &times;
      </button>
      <div class="checkout-modal-container">
    `;

    const addresses = await dbGetUserAddresses();
    const defaultAddressId = await dbGetDefaultAddress();

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        const isDefault = address.aid === defaultAddressId;

        addressModalHTML += `            
          <div class="checkout-modal-card checkout-address-card" data-address-id=${
            address.aid
          }>
          ${
            isDefault ? `<p class="checkout-modal-default-tag">Default</p>` : ``
          }    
            <h3>${address.fullName}</h3>
            <p>${address.addressOne}</p>
            <p>${address.addressTwo}</p>
            <p>${address.city}, ${address.state} ${address.zip}</p>
            <p>Phone number: ${address.phone}</p>            
          </div>
        `;
      });
    }

    addressModalHTML += `</div>`;

    addressModal.html(addressModalHTML);

    openModal(addressModal);

    $(".checkout-address-card").each(function () {
      $(this).on("click", function () {
        const aId = $(this).data("addressId");
        closeModal(addressModal);
        renderAddressHTML(aId);
      });
    });

    $("#js-checkout-overlay, #js-checkout-address-close-btn").on(
      "click",
      () => {
        closeModal(addressModal);
        closeModal(paymentModal);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

async function renderPaymentHTML(pId) {
  try {
    let paymentId = pId || (await dbGetDefaultPayment());
    const payment = await dbGetPaymentById(paymentId);
    const lastFour = payment.cardNum.substr(payment.cardNum.length - 4);

    let paymentHTML = `  
      <div class="method-header">
        <h3>Paying with <span>${payment.type} ${lastFour}</span></h3>
        <a id="js-payment-change-btn">Change</a>
      </div>
      <p>${payment.fullName}</p>
    `;

    $("#js-checkout-payment").html(paymentHTML);

    $("#js-payment-change-btn").on("click", () => {
      renderPaymentModal();
    });
  } catch (error) {
    console.log(error);
  }
}

async function renderPaymentModal() {
  try {
    let paymentModalHTML = `
      <h2>Your Payments</h2>
      <button class="checkout-modal-close-btn" id="js-checkout-payment-close-btn">
        &times;
      </button>
      <div class="checkout-modal-container">
    `;

    const payments = await dbGetUserPayments();
    const defaultPaymentId = await dbGetDefaultPayment();

    if (payments.length > 0) {
      payments.forEach((payment) => {
        const cardNum = maskCardNumber(payment.cardNum);
        const isDefault = payment.pid === defaultPaymentId;

        paymentModalHTML += `  
          <div class="checkout-modal-card checkout-payment-card" data-payment-id=${
            payment.pid
          }>
            ${
              isDefault
                ? `<p class="checkout-modal-default-tag">Default</p>`
                : ``
            }    
            <h3>${payment.fullName}</h3>
            <p>${payment.type}</p>
            <p>${cardNum}</p>
            <p>${payment.expDate}</p>            
          </div>
        `;
      });
    }

    paymentModalHTML += `</div>`;

    paymentModal.html(paymentModalHTML);

    openModal(paymentModal);

    $(".checkout-payment-card").each(function () {
      $(this).on("click", function () {
        const pId = $(this).data("paymentId");
        closeModal(paymentModal);
        renderPaymentHTML(pId);
      });
    });

    $("#js-checkout-overlay, #js-checkout-method-close-modal-btn").on(
      "click",
      () => {
        closeModal(addressModal);
        closeModal(paymentModal);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function openModal(modal) {
  if (modal != null) {
    modal.addClass("active");
    $("#js-checkout-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $("#js-checkout-overlay").removeClass("active");
  }
}
