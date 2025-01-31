import { handleWindow } from "./utils/window.js";
import { getConcertByID } from "./data/concerts.js";
import { formatDateMDYLong, formatTime } from "./utils/date.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTicketHTML();
}

function renderTicketHTML() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("eventId");
  const concert = getConcertByID(id);

  const date = formatDateMDYLong(concert.date);
  const time = formatTime(concert.time);

  const location = `${concert.city}, ${concert.state}`;
  const venue = concert.venue;

  let ticketHTML = `
    <h2>Tickets Checkout</h2>

      <ul class="ticket-info-list">
        <li>${date}</li>
        <li>${time} (EST)</li>
        <li>${location}, USA</li>
        <li>${venue}</li>
      </ul>

      <div>
        <div class="ticket-field ticket-type">
          <label for="ticket-type">Type</label>
          <select name="ticket-type">
            <option value="S">Standard</option>
            <option value="V">VIP</option>
          </select>
        </div>

        <div class="ticket-field ticket-amount">
          <label for="ticket-amount">Quantity</label>
          <input
            name="ticket-amount"
            type="number"
            value="1"
            min="1"
            max="10"
          />
        </div>

        <div class="ticket-field ticket-price">
          <label for="ticket-price">Price</label>
          <input
            name="ticket-price"
            readonly
            type="text"
            value="$25.00"
          />
        </div>
      </div>

      <button class="tickets-add-btn">Add to Cart</button>
  `;

  $("#js-tickets-container").html(ticketHTML);
}
