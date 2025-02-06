import {
  dbAddAddress,
  dbGetAddress,
  dbGetAddresses,
  dbGetUser,
  dbRemoveAddress,
  dbUpdateAddress,
} from "./data/database.js";
import {
  checkEmptyInput,
  disableNonNumericInput,
  formatPhoneNumber,
  isPhoneValid,
  isZipValid,
  showFormAlert,
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
  } catch (error) {
    window.location.href = "login.html";
  }
}

async function renderAddressHTML() {
  let addressHTML = ``;

  try {
    const addresses = await dbGetAddresses();

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        addressHTML += `  
        <div class="address-card">
          <h3>${address.fullName}</h3>
          <p>${address.addressOne}</p>
          <p>${address.addressTwo}</p>
          <p>${address.city}, ${address.state} ${address.zip}</p>
          <p>Phone number: ${address.phone}</p>
          <div class="address-card-btn-container">
            <a class="link edit-address-btn" data-address-id=${address.aId}>Edit</a>
            <a class="link remove-address-btn" data-address-id=${address.aId}>Remove</a>
          </div>
        </div>
      `;
      });
    } else {
      addressHTML += `    
      <h3 class="address-empty-text">You have no existing addresses!</h3>
    `;
    }

    addressHTML += `
    <div class="address-new-container" id="js-address-new-container">
      <i class="fa-solid fa-plus"></i>
      <a class="address-new-btn">Add Address</a>
    </div>
  `;

    $("#js-address-container").html(addressHTML);

    handleModal();
  } catch (error) {
    console.log("error");
    window.location.href = "account.hmtl";
  }
}

function handleModal() {
  $(".edit-address-btn").on("click", function () {
    const addressId = $(this).data("address-id");
    renderModalHTML(addressId);
    openModal(modal);
  });

  $(".remove-address-btn").on("click", function () {
    const addressId = $(this).data("address-id");
    dbRemoveAddress(addressId);
    renderAddressHTML();
  });

  $("#js-address-new-container").on("click", () => {
    renderModalHTML();
    openModal(modal);
  });
}

async function renderModalHTML(addressId) {
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
      address = await dbGetAddress(addressId);
    } catch (error) {
      console.log(error);
      window.location.href = "account.html";
    }

    fullName = address.fullName;
    phone = address.phone;
    addressOne = address.addressOne;
    addressTwo = address.addressTwo;
    city = address.city;
    state = address.state;
    zip = address.zip;
  }

  let modalHTML = `
    <button class="address-close-btn" id="js-address-close-modal-btn">
      &times;
    </button>

    ${addressId ? `<h3>Edit Your Address</h3>` : `<h3>Add New Address</h3>`}

    <form class="address-modal-form" id="js-address-modal-form">
      <div class="address-modal-field">
        <label for="name">Full Name</label>
        <input id="js-address-modal-name" name="name" type="text" value="${fullName}" />
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
          <option value="">Select state</option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
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

      <div class="address-modal-save-container">
        <div class="db-alert js-db-alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p class="js-db-alert-message">error!</p>
        </div>
        <button class="address-modal-btn" type="submit">
          Save Changes
        </button>
      </div>
    </form>  
  `;

  $("#js-address-modal").html(modalHTML);
  $("#js-address-modal-state").val(`${state}`);

  $("#js-address-overlay, #js-address-close-modal-btn").on("click", () => {
    closeModal(modal);
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

    if (addressId) {
      dbUpdateAddress(
        addressId,
        fullName.val(),
        phone.val(),
        addressOne.val(),
        addressTwo.val(),
        city.val(),
        state.val(),
        zip.val()
      );
    } else {
      dbAddAddress(
        fullName.val(),
        phone.val(),
        addressOne.val(),
        addressTwo.val(),
        city.val(),
        state.val(),
        zip.val()
      );
    }
  });
}

function openModal(modal) {
  if (modal != null) {
    modal.addClass("active");
    $("#js-address-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $("#js-address-overlay").removeClass("active");
  }
}
