import { identifyCardType } from "./creditCard.js";

let timeouts = [];

export function checkEmptyForm(form) {
  form.find(":input:not(:button)").each(function () {
    !$(this).val()
      ? $(this).addClass("invalid-field")
      : $(this).removeClass("invalid-field");
  });
}

export function checkEmptyInput(field) {
  !field.val() && field.attr("name") !== "address-two"
    ? field.addClass("invalid-field")
    : field.removeClass("invalid-field");
}

export function disableNonNumericInput(e) {
  if (e.ctrlKey) return;
  if (e.key.length > 1) return;
  if (/[0-9.]/.test(e.key)) return;

  e.preventDefault();
}
export function formatPhoneNumber(e) {
  const digits = e.target.value.replace(/\D/g, "").substring(0, 10);

  const areaCode = digits.substring(0, 3);
  const prefix = digits.substring(3, 6);
  const suffix = digits.substring(6, 10);

  if (digits.length > 6) {
    e.target.value = `(${areaCode}) ${prefix} - ${suffix}`;
  } else if (digits.length > 3) {
    e.target.value = `(${areaCode}) ${prefix}`;
  } else if (digits.length > 0) {
    e.target.value = `(${areaCode}`;
  }
}

export function formatCardNumber(e) {
  const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
  e.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

export function formatDate(e) {
  const digits = e.target.value.replace(/\D/g, "").substring(0, 4);

  const month = digits.substring(0, 2);
  const year = digits.substring(2, 4);

  if (digits.length > 2) {
    e.target.value = `${month}/${year}`;
  }
}

export function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isPhoneValid(phone) {
  return phone.length === 16;
}

export function isPasswordValid(password) {
  return password.length >= 8;
}

export function isZipValid(zip) {
  return zip.length == 5 && !isNaN(zip);
}

export function isCardNumValid(cardNum) {
  return identifyCardType(cardNum) !== "null";
}

export function isSecurityCodeValid(code, type) {
  let length = type === "AMEX" ? 4 : 3;
  return code.length == length && !isNaN(code);
}

export function isExpDateValid(date) {
  return date.length == 5;
}

export function showFormAlert(message) {
  $(".js-db-alert-message").html(message);
  $(".js-db-alert").css("opacity", 1);

  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
    timeouts.pop();
  }

  timeouts.push(
    setTimeout(function () {
      $(".js-db-alert").css("opacity", 0);
    }, 3000)
  );
}
export function hideFormAlert() {
  $(".js-db-alert").css("opacity", 0);
  $("input").removeClass("invalid-field");
}

export function showLoginErrorModal() {
  $("#js-alert-modal").addClass("active");
  $("#js-modal-overlay").addClass("active");
}

export let statesOptionList = `
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
`;
