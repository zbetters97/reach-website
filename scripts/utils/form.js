let timeouts = [];

export function checkEmptyForm(form) {
  form.find(":input:not(:button)").each(function () {
    !$(this).val()
      ? $(this).addClass("invalid-field")
      : $(this).removeClass("invalid-field");
  });
}

export function checkEmptyInput(field) {
  !field.val()
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

export function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isPhoneValid(phone) {
  return phone.length === 16;
}

export function isPasswordValid(password) {
  const minPasswordLength = 8;
  return password.length >= minPasswordLength;
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
