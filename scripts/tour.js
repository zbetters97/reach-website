import { concerts } from "./data/concerts.js";

$(document).ready(function () {
  const getOffset = () => $(".navbar").offset().top;
  let contentOffset = getOffset();
  $(window).resize(() => (contentOffset = getOffset()));

  $(window).scroll(() => {
    $(window).scrollTop() > contentOffset
      ? $(".to-top").css("opacity", ".9")
      : $(".to-top").css("opacity", "0");
  });

  $(".to-top").click(() => {
    $("body, html").animate({ scrollTop: $("#navbar").offset().top }, 800);
    return !1;
  });

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
