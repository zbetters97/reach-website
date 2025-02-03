export function checkEmptyInput(field) {
  !field.val()
    ? field.addClass("invalid-field")
    : field.removeClass("invalid-field");
}

export function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isPasswordValid(password) {
  const minPasswordLength = 8;
  return password.length >= minPasswordLength;
}

export function showFormAlert(message) {
  $(".js-db-alert-message").html(message);
  $(".js-db-alert").css("opacity", 1);
}
export function hideFormAlert() {
  $(".js-db-alert").css("opacity", 0);
}
