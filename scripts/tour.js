import { handleWindow } from "./utils/window.js";
import { concerts } from "./data/concerts.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTourHTML();
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
