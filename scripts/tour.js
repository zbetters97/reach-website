import { handleWindow } from "./utils/window.js";
import { findClosestConcert, getCurrentLocation, initMap } from "./data/map.js";
import concerts from "./data/concerts.js";

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
    tourHTML += `
      <section class="concert-section">
        <div class="concert-container">
          <h3 class="concert-title">${event.date} @ ${event.time} (EST)</h3>
          <h4 class="concert-info">${event.city}, ${event.state}</h4>
          <h4 class="concert-info">${event.venue}</h4>
          <div class="concert-seperator"></div>
          <a class="concert-info link" href="">-Tickets-</a>
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
      console.log("error");
    }
  });

  $("#js-map-submit").on("click", () => {
    if (addressInput.val()) {
      showLoading("submit");
      findClosestConcert(addressInput.val(), concerts);
    } else {
      console.log("error");
    }
  });
}

function showLoading(button) {
  $(`#js-map-${button}`).removeClass("btn-hover");
  $(`#js-map-${button}-icon`).css("display", "inherit");
  $(`#js-map-${button}-text`).hide();
}
