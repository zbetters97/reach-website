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
  renderTicketHTML();
}

function renderTicketHTML() {
  const url = new URL(window.location.href);
  const ticketId = url.searchParams.get("eventId");
  const concert = getConcert(ticketId);

  const date = formatDateMDYLong(concert.date);
  const time = formatTime(concert.time);

  const location = `${concert.city}, ${concert.state}`;
  const venue = concert.venue;

  totalPrice = formatCurrency(concert.ticketPrice["Standard"]);

  let ticketHTML = `
    <ul class="ticket-info-list">
      <li>${date}</li>
      <li>${time} (EST)</li>
      <li>${location}, USA</li>
      <li>${venue}</li>
    </ul>

    <div>
      <div class="ticket-field ticket-type">
        <label for="ticket-type">Type</label>
        <select id="js-ticket-type" name="ticket-type">
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      <div class="ticket-field ticket-quantity">
        <label for="ticket-quantity">Quantity</label>
        <input
          id="js-ticket-quantity"          
          name="ticket-quantity"
          type="number"
          value="1"
          min="1"
          max="10"
        />
      </div>

      <div class="ticket-field ticket-price">
        <label for="ticket-price">Price</label>
        <input
          id="js-ticket-price"
          name="ticket-price"
          readonly
          type="text"
          value="$${totalPrice}"
        />
      </div>
    </div>

    <div class="ticket-added-alert" id="js-ticket-added-alert">
      <i class="fa-solid fa-check"></i>
      <p>Added to cart</p>
    </div>
    <button class="tickets-add-btn" id="js-tickets-add-btn">Add to Cart</button>
  `;

  $("#js-tickets-container").html(ticketHTML);

  const ticketQuantity = $("#js-ticket-quantity");
  const ticketType = $("#js-ticket-type");

  ticketQuantity.keypress(function (event) {
    event.preventDefault();
  });

  ticketQuantity.change(function () {
    updateTotal(concert);
  });

  ticketType.change(function () {
    updateTotal(concert);
  });

  $("#js-tickets-add-btn").on("click", () => {
    const quantity = ticketQuantity.val();
    if (quantity > 10 || quantity < 1) return;

    cart.addToCart(ticketId, parseInt(quantity), "T", ticketType.val());
    showAddToCartMsg();
  });
}

function updateTotal(concert) {
  const quantity = $("#js-ticket-quantity").val();
  const type = $("#js-ticket-type").val();
  const price = concert.ticketPrice[type];

  totalPrice = formatCurrency(price * quantity);
  $("#js-ticket-price").val(`$${totalPrice}`);
}

function showAddToCartMsg() {
  const addedMessage = $("#js-ticket-added-alert");
  addedMessage.css("opacity", "1");

  setTimeout(() => {
    addedMessage.css("opacity", "0");
  }, 2000);
}
