import { handleWindow } from "./utils/window.js";
import { getConcert } from "./data/concerts.js";
import { formatDateMDYLong, formatTime } from "./utils/date.js";
import formatCurrency from "./utils/money.js";
import cart from "./data/cart.js";

let totalPrice = 0;

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTicketInfoHTML();
}

function renderTicketInfoHTML() {
  const url = new URL(window.location.href);
  const ticketId = url.searchParams.get("eventId");
  const concert = getConcert(ticketId);

  if (!concert) {
    window.location.href = "tour.html";
    return;
  }

  const date = formatDateMDYLong(concert.date);
  const time = formatTime(concert.time);

  const location = `${concert.city}, ${concert.state}`;
  const venue = concert.venue;

  $("#js-ticket-info-list").html(
    `<li>${date}</li>
    <li>${time} (EST)</li>
    <li>${location}, USA</li>
    <li>${venue}</li>`
  );

  const type = $("#js-ticket-type");
  const basePrice = concert.ticketPrice[type.val()];
  const quantity = $("#js-ticket-quantity");

  totalPrice = formatCurrency(basePrice * parseInt(quantity.val()));

  $("#js-ticket-price").val(`$${totalPrice}`);

  quantity.keypress((event) => event.preventDefault());
  quantity.change(() => updateTotal(concert));

  type.change(() => updateTotal(concert));

  $("#js-tickets-add-btn").on("click", () =>
    addTicket(ticketId, type.val(), parseInt(quantity.val()))
  );
}

function addTicket(id, type, quantity) {
  const ticketAlert = $("#js-ticket-alert");

  if (isNaN(quantity) || quantity > 10 || quantity < 1) {
    ticketAlert.html(
      `<i class="fa-solid fa-circle-exclamation"></i>
      <p class="js-db-alert-message">Please provide a valid quantity!</p>`
    );
    ticketAlert.css("color", "red");

    showAddToCartMsg();
    return;
  }

  ticketAlert.html(
    `<i class="fa-solid fa-check"></i>
      <p>Added to cart</p>`
  );
  ticketAlert.css("color", "green");

  cart.addToCart(id, quantity, "T", type);
  showAddToCartMsg();
}

function updateTotal(concert) {
  const quantity = $("#js-ticket-quantity").val();
  const type = $("#js-ticket-type").val();
  const price = concert.ticketPrice[type];

  totalPrice = formatCurrency(price * quantity);
  $("#js-ticket-price").val(`$${totalPrice}`);
}

function showAddToCartMsg() {
  const addedMessage = $("#js-ticket-alert");
  addedMessage.css("opacity", "1");

  setTimeout(() => addedMessage.css("opacity", "0"), 2000);
}
