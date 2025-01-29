import { handleWindow } from "./utils/window.js";
import {
  findClosestConcert,
  getCurrentLocation,
  initMap,
  setTourMarkers,
} from "./data/map.js";
import concerts from "./data/concerts.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTourHTML();
  initMap();
  setTourMarkers(concerts);
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
    $("#js-map-autofill").removeClass("btn-hover");
    $("#js-map-autofill-icon").css("display", "inherit");
    $("#js-map-autofill-text").hide();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        getCurrentLocation(position);
      });
    } else {
      alert("Geolocation is not supported by your browser!");
    }
  });

  $("#js-map-submit").on("click", () => {
    if (!addressInput.val()) {
      alert("error");
    } else {
      findClosestConcert(addressInput.val(), concerts);
    }
  });
}
