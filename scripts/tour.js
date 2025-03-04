import { handleWindow } from "./utils/window.js";
import { findClosestConcert, getCurrentLocation, initMap } from "./data/map.js";
import concerts from "./data/concerts.js";
import { formatDateMDShort, formatTime } from "./utils/date.js";
import { showFormAlert } from "./utils/form.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTourHTML();
  initMap(concerts);
  handleForm();
}

function renderTourHTML() {
  let tourHTML = ``;

  concerts.forEach((event) => {
    const date = formatDateMDShort(event.date);
    const time = formatTime(event.time);
    const location = `${event.city}, ${event.state}`;
    const venue = event.venue;
    const ticketId = event.ticketId;

    tourHTML += `
      <section class="concert-section">
        <div class="concert-container">
          <h3 class="concert-title">${date} @ ${time}</h3>
          <h4 class="concert-info">${location}</h4>
          <h4 class="concert-info concert-venue">${venue}</h4>
          <div class="concert-seperator"></div>
          <a class="concert-info link" href="tickets.html?eventId=${ticketId}">-Tickets-</a>
        </div>
      </section>
    `;
  });

  $("#js-events-container").html(tourHTML);
}

function handleForm() {
  const addressInput = $("#js-map-address");

  $("#js-map-autofill").on("click", () => {
    showLoading("autofill");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        getCurrentLocation(position);
      });
    } else {
      showFormAlert("Something went wrong!");
    }
  });

  $("#js-map-submit").on("click", () => {
    if (addressInput.val()) {
      showLoading("submit");
      findClosestConcert(addressInput.val(), concerts);
    } else {
      showFormAlert("Please provide an address!");
    }
  });
}

function showLoading(button) {
  $(`#js-map-${button}`).removeClass("btn-hover");
  $(`#js-map-${button}-icon`).css("display", "inherit");
  $(`#js-map-${button}-text`).hide();
}
