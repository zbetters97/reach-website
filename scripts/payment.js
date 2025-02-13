import {
  dbAddPayment,
  dbGetPaymentById,
  dbGetUserPayments,
  dbGetUser,
  dbRemovePayment,
  dbUpdatePayment,
  dbGetDefaultPayment,
  dbSetDefaultPayment,
} from "./data/database.js";
import { identifyCardType, maskCardNumber } from "./utils/creditCard.js";
import {
  checkEmptyInput,
  disableNonNumericInput,
  formatDate,
  isCardNumValid,
  isExpDateValid,
  isSecurityCodeValid,
  showFormAlert,
  showLoginErrorModal,
} from "./utils/form.js";
import { handleWindow } from "./utils/window.js";

const modal = $("#js-payment-modal");

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
    renderPaymentHTML();
  } catch (error) {
    console.log(error);
    showLoginErrorModal();
  }
}

async function renderPaymentHTML() {
  let paymentHTML = `
    <div class="payment-new-container" id="js-payment-new-container">
      <i class="fa-solid fa-plus"></i>
      <a class="payment-new-btn">Add Payment</a>
    </div>
  `;

  try {
    const payments = await dbGetUserPayments();
    const defaultPaymentId = await dbGetDefaultPayment();

    if (payments.length > 0) {
      payments.forEach((payment) => {
        const cardNum = maskCardNumber(payment.cardNum);
        const isDefault = payment.pid === defaultPaymentId;

        paymentHTML += `  
          <div class="payment-card">
            ${isDefault ? `<p class="payment-default-tag">Default</p>` : ``}    
            <h3>${payment.fullName}</h3>
            <p>${payment.type}</p>
            <p>${cardNum}</p>
            <p>${payment.expDate}</p>            
            <div class="payment-card-btn-container">
            ${
              isDefault
                ? ``
                : `<a class="link set-default-payment-btn" data-payment-id=${payment.pid}>Make Default</a>`
            }              
              <a class="link edit-payment-btn" data-payment-id=${payment.pid}>
                Edit
              </a>
              <a class="link remove-payment-btn" data-payment-id=${payment.pid}>
                Remove
              </a>
            </div>
          </div>
        `;
      });
    } else {
      paymentHTML += `    
        <h3 class="payment-empty-text">You have no saved payments!</h3>
      `;
    }

    $("#js-payment-container").html(paymentHTML);

    $(".set-default-payment-btn").on("click", function () {
      const paymentId = $(this).data("payment-id");
      dbSetDefaultPayment(paymentId);
      renderPaymentHTML();
    });

    $(".edit-payment-btn").on("click", function () {
      const paymentId = $(this).data("payment-id");
      renderModalHTML(paymentId);
      openModal(modal);
    });

    $(".remove-payment-btn").on("click", function () {
      const paymentId = $(this).data("payment-id");
      dbRemovePayment(paymentId);
    });

    $("#js-payment-new-container").on("click", () => {
      renderModalHTML();
      openModal(modal);
    });
  } catch (error) {
    console.log(error);
    window.location.href = "account.html";
  }
}

async function renderModalHTML(paymentId) {
  let isDefault = false;
  let fullName = "";
  let type = "";
  let cardNum = "";
  let code = "";
  let expDate = "";

  if (paymentId) {
    let payment;

    try {
      payment = await dbGetPaymentById(paymentId);
      const defaultPaymentId = await dbGetDefaultPayment();
      isDefault = paymentId === defaultPaymentId;

      fullName = payment.fullName;
      type = payment.type;
      cardNum = payment.cardNum;
      code = payment.code;
      expDate = payment.expDate;
    } catch (error) {
      console.log(error);
      paymentId = "";
    }
  }

  let modalHTML = `
    <button class="payment-close-btn" id="js-payment-close-modal-btn">
      &times;
    </button>

    ${paymentId ? `<h3>Edit Your Payment</h3>` : `<h3>Add New Payment</h3>`}

    <form class="payment-modal-form" id="js-payment-modal-form">
      <div class="payment-modal-field">
        <label for="full-name">Name on Card</label>
        <input id="js-payment-modal-name" name="full-name" type="text" value="${fullName}" />
      </div>

      <div class="payment-modal-field">
        <label for="card-number">Card Number</label>
        <input
          id="js-payment-modal-number"
          name="card-number"
          ${paymentId ? `type="password"` : `type="text"`}
          maxLength="20"
          value="${cardNum}"          
        />
      </div>

      <div class="payment-modal-field">
        <label for="code">Security Code</label>
        <input
          id="js-payment-modal-code"
          name="code"
          ${paymentId ? `type="password"` : `type="text"`}
          maxLength="4"
          value="${code}"
          
        />
      </div>

      <div class="payment-modal-field">
        <label for="exp-date">Expiration Date</label>
        <input 
          id="js-payment-modal-date" 
          name="exp-date" 
          type="text" 
          maxLength="5"           
          value="${expDate}"
          placeholder="MM/DD"
        />
      </div>

      <div class="payment-modal-field">
        <label for="default">Default</label>
        <input
          id="js-payment-modal-default"
          name="default"
          type="checkbox"
        />
      </div>

      <div class="payment-modal-save-container">
        <div class="db-alert js-db-alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p class="js-db-alert-message">error!</p>
        </div>
        <button class="payment-modal-btn" type="submit">
          ${paymentId ? `Save Changes` : `Add Payment`}
        </button>
      </div>
    </form>  
  `;

  $("#js-payment-modal").html(modalHTML);
  $("#js-payment-modal-default").prop("checked", isDefault);

  $("#js-modal-overlay, #js-payment-close-modal-btn").on("click", () => {
    closeModal(modal);
  });

  $("#js-payment-success-btn").on("click", () => {
    closeModal($("#js-success-modal"));
    renderPaymentHTML();
  });

  handleSubmitPayment(paymentId);
}

function handleSubmitPayment(paymentId) {
  $("#js-payment-modal-form :input:not(:button)").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  const cardNum = $("#js-payment-modal-number");
  cardNum.on("keydown", disableNonNumericInput, removeInputMask);
  //cardNum.on("keyup", formatCardNumber);

  const code = $("#js-payment-modal-code");
  code.on("keydown", disableNonNumericInput, removeInputMask);

  function removeInputMask() {
    if ($(this).attr("type") === "password") {
      $(this).val("");
      $(this).attr("type", "text");
    }
  }

  const expDate = $("#js-payment-modal-date");
  expDate.on("keydown", disableNonNumericInput);
  expDate.on("keyup", formatDate);

  $("#js-payment-modal-form").submit(function (event) {
    event.preventDefault();

    let isValid = true;

    $(this)
      .find(":input:not(:button)")
      .each(function () {
        checkEmptyInput($(this));
        if (!$(this).val()) {
          isValid = false;
          showFormAlert("Please fill out highlighted fields!");
        }
      });

    if (!isValid) return;

    const fullName = $("#js-payment-modal-name");
    const cardNum = $("#js-payment-modal-number");
    const code = $("#js-payment-modal-code");
    const expDate = $("#js-payment-modal-date");
    const isDefault = $("#js-payment-modal-default");

    if (!isCardNumValid(cardNum.val())) {
      cardNum.addClass("invalid-field");
      showFormAlert("The card number is not valid!");

      return;
    }

    const cardType = identifyCardType(cardNum.val());

    if (!isSecurityCodeValid(code.val(), cardType)) {
      code.addClass("invalid-field");
      showFormAlert("The security code is not valid!");

      return;
    }
    if (!isExpDateValid(expDate.val())) {
      expDate.addClass("invalid-field");
      showFormAlert("The expiration date is not valid!");

      return;
    }

    const paymentInfo = {
      fullName: fullName.val(),
      cardNum: cardNum.val(),
      code: code.val(),
      expDate: expDate.val(),
      type: cardType,
    };

    if (paymentId) {
      dbUpdatePayment(paymentId, paymentInfo, isDefault.prop("checked"));
    } else {
      dbAddPayment(paymentInfo, isDefault.prop("checked"));
    }
  });
}

function openModal(modal) {
  if (modal != null) {
    modal.addClass("active");
    $("#js-modal-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $("#js-modal-overlay").removeClass("active");
  }
}
