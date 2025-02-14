import {
  dbAddAddress,
  dbGetAddressById,
  dbGetUserAddresses,
  dbGetDefaultAddress,
  dbGetUser,
  dbRemoveAddress,
  dbSetDefaultAddress,
  dbUpdateAddress,
} from "./data/database.js";
import {
  checkEmptyInput,
  disableNonNumericInput,
  formatPhoneNumber,
  isPhoneValid,
  isZipValid,
  showFormAlert,
  showLoginErrorModal,
  statesOptionList,
} from "./utils/form.js";
import { handleWindow } from "./utils/window.js";

const modal = $("#js-address-modal");

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
    renderAddressHTML();
  } catch {
    showLoginErrorModal();
  }
}

async function renderAddressHTML() {
  let addressHTML = ``;

  try {
    const addresses = await dbGetUserAddresses();
    const defaultAddressId = await dbGetDefaultAddress();

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        const isDefault = address.aid === defaultAddressId;

        addressHTML += `  
          <div class="address-card">
            ${isDefault ? `<p class="address-default-tag">Default</p>` : ``}    
            <h3>${address.fullName}</h3>
            <p>${address.addressOne}</p>
            <p>${address.addressTwo}</p>
            <p>${address.city}, ${address.state} ${address.zip}</p>
            <p>Phone number: ${address.phone}</p>
            <div class="address-card-btn-container">
             ${
               isDefault
                 ? ``
                 : `<a class="link set-default-address-btn" data-address-id=${address.aid}>Make Default</a>`
             }          
              <a class="link edit-address-btn" data-address-id=${address.aid}>
                Edit
              </a>
              <a class="link remove-address-btn" data-address-id=${address.aid}>
                Remove
              </a>
            </div>
          </div>
        `;
      });
    } else {
      addressHTML += `    
        <h3 class="address-empty-text">You have no saved addresses!</h3>
      `;
    }

    addressHTML += `
      <div class="address-new-container" id="js-address-new-container">
        <i class="fa-solid fa-plus"></i>
        <a class="address-new-btn">Add Address</a>
      </div>
    `;

    $("#js-address-container").html(addressHTML);

    $(".set-default-address-btn").on("click", function () {
      const addressId = $(this).data("address-id");
      dbSetDefaultAddress(addressId);
      renderAddressHTML();
    });

    $(".edit-address-btn").on("click", function () {
      const addressId = $(this).data("address-id");
      renderModalHTML(addressId);
      openModal(modal);
    });

    $(".remove-address-btn").on("click", function () {
      const addressId = $(this).data("address-id");
      deleteAddress(addressId);
    });

    $("#js-address-new-container").on("click", () => {
      renderModalHTML();
      openModal(modal);
    });
  } catch (error) {
    console.log(error);
    window.location.href = "account.html";
  }
}

async function deleteAddress(addressId) {
  await dbRemoveAddress(addressId);
  renderAddressHTML();
}

async function renderModalHTML(addressId) {
  let isDefault = false;
  let fullName = "";
  let addressOne = "";
  let addressTwo = "";
  let city = "";
  let state = "";
  let zip = "";
  let phone = "";

  if (addressId) {
    let address;

    try {
      address = await dbGetAddressById(addressId);
      const defaultAddressId = await dbGetDefaultAddress();
      isDefault = addressId === defaultAddressId;

      fullName = address.fullName;
      phone = address.phone;
      addressOne = address.addressOne;
      addressTwo = address.addressTwo;
      city = address.city;
      state = address.state;
      zip = address.zip;
    } catch (error) {
      console.log(error);
      addressId = "";
    }
  }

  let modalHTML = `
    <button class="address-close-btn" id="js-address-close-modal-btn">
      &times;
    </button>

    ${addressId ? `<h3>Edit Your Address</h3>` : `<h3>Add New Address</h3>`}

    <form class="address-modal-form" id="js-address-modal-form">
      <div class="address-modal-field">
        <label for="full-name">Full Name</label>
        <input id="js-address-modal-name" name="full-name" type="text" value="${fullName}" />
      </div>

      <div class="address-modal-field">
        <label for="phone">Phone Number</label>
        <input
          id="js-address-modal-phone"
          name="phone"
          type="tel"
          maxlength="16"
          value="${phone}"
        />
      </div>

      <div class="address-modal-field">
        <label for="address-one">Address Line 1</label>
        <input
          id="js-address-modal-address-one"
          name="address-one"
          type="text"
          value="${addressOne}"
        />
      </div>

      <div class="address-modal-field">
        <label for="address-two">Address Line 2</label>
        <input
          id="js-address-modal-address-two"
          name="address-two"
          type="text"
          value="${addressTwo}"
        />
      </div>

      <div class="address-modal-field">
        <label for="city">City</label>
        <input id="js-address-modal-city" name="city" type="text" value="${city}" />
      </div>

      <div class="address-modal-field">
        <label for="state">State</label>
        <select id="js-address-modal-state" name="state">
          ${statesOptionList}
        </select>
      </div>

      <div class="address-modal-field">
        <label for="zip">ZIP Code</label>
        <input
          id="js-address-modal-zip"
          name="zip"
          type="text"
          maxlength="5"
          value="${zip}"
        />
      </div>

      <div class="address-modal-field">
        <label for="default">Default</label>
        <input
          id="js-address-modal-default"
          name="default"
          type="checkbox"
        />
      </div>

      <div class="address-modal-save-container">
        <div class="db-alert js-db-alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p class="js-db-alert-message">error!</p>
        </div>
        <button class="address-modal-btn" type="submit">
          ${addressId ? `Save Changes` : `Add Address`}
        </button>
      </div>
    </form>  
  `;

  $("#js-address-modal").html(modalHTML);
  $("#js-address-modal-state").val(`${state}`);
  $("#js-address-modal-default").prop("checked", isDefault);

  $("#js-modal-overlay, #js-address-close-modal-btn").on("click", () => {
    closeModal(modal);
  });

  $("#js-address-success-btn").on("click", () => {
    closeModal($("#js-success-modal"));
    renderAddressHTML();
  });

  handleSubmitAddress(addressId);
}

function handleSubmitAddress(addressId) {
  $("#js-address-modal-form :input:not(:button)").each(function () {
    $(this).on("click", function () {
      $(this).removeClass("invalid-field");
    });
  });

  const phone = $("#js-address-modal-phone");
  phone.on("keydown", disableNonNumericInput);
  phone.on("keyup", formatPhoneNumber);

  const zip = $("#js-address-modal-zip");
  zip.on("keydown", disableNonNumericInput);

  $("#js-address-modal-form").submit(function (event) {
    event.preventDefault();

    let isValid = true;

    $(this)
      .find(":input:not(:button)")
      .each(function () {
        checkEmptyInput($(this));
        if (!$(this).val() && $(this).attr("name") !== "address-two") {
          isValid = false;
          showFormAlert("Please fill out highlighted fields!");
        }
      });

    if (!isValid) return;

    const fullName = $("#js-address-modal-name");
    const phone = $("#js-address-modal-phone");
    const addressOne = $("#js-address-modal-address-one");
    const addressTwo = $("#js-address-modal-address-two");
    const city = $("#js-address-modal-city");
    const state = $("#js-address-modal-state");
    const zip = $("#js-address-modal-zip");
    const isDefault = $("#js-address-modal-default");

    if (!isPhoneValid(phone.val())) {
      phone.addClass("invalid-field");
      showFormAlert("The phone number is not valid!");

      return;
    }

    if (!isZipValid(zip.val())) {
      zip.addClass("invalid-field");
      showFormAlert("The ZIP code is not valid!");

      return;
    }

    const addressInfo = {
      fullName: fullName.val(),
      phone: phone.val(),
      addressOne: addressOne.val(),
      addressTwo: addressTwo.val(),
      city: city.val(),
      state: state.val(),
      zip: zip.val(),
    };

    if (addressId) {
      dbUpdateAddress(addressId, addressInfo, isDefault.prop("checked"));
    } else {
      dbAddAddress(addressInfo, isDefault.prop("checked"));
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
