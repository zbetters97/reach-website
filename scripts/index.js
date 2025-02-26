import { handleWindow } from "./utils/window.js";
import concerts from "./data/concerts.js";
import albums from "./data/albums.js";
import { formatDateMDShort, formatTime } from "./utils/date.js";

const darkenHero = () => {
  $(".hero-overlay").css(
    "background",
    `rgba(0, 45, 95, ${(window.scrollY * 1) / window.innerHeight})`
  );
};

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  darkenHero();
  handleHeroScroll();
  renderAlbumHTML();
  renderTourHTML();
}

function handleHeroScroll() {
  $(window).scroll(() => {
    darkenHero();
  });
}

function renderAlbumHTML() {
  const album = albums[albums.length - 1];
  const image = album.image;
  const title = album.title;

  let songsHTML = ``;
  album.songs.forEach((song) => (songsHTML += `<li>${song}</li>`));

  let albumHTML = `
    <img class="home-album-img" src="${image}" />
    <div class="home-album">
      <h3 class="home-subheader home-album-title">${title}</h3>
      <ol class="home-album-songs" type="1">
        ${songsHTML}
      </ol>
        <button 
          class="forward-btn home-btn home-album-btn" type="button" 
          onclick="location.href='music.html'"
        >
          View all releases
        </button>
    </div>
  `;

  $("#js-home-album-container").html(albumHTML);
}

function renderTourHTML() {
  let concertsHTML = ``;

  const homePageConcerts = concerts.slice(0, 3);

  homePageConcerts.forEach((concert) => {
    const date = formatDateMDShort(concert.date);
    const time = formatTime(concert.time);
    const location = `${concert.city}, ${concert.state}`;

    concertsHTML += `
      <div class="home-tour">
        <p>${date} @ ${time} (EST)</p>
        <p>${location}</p>
        <p>${concert.venue}</p>
      </div>
    `;
  });

  concertsHTML += `
    <button 
      class="forward-btn home-btn home-tour-btn" 
      type="button" 
      onclick="location.href='tour.html'"
    >
      Find more dates
    </button>
  `;

  $("#js-home-tours").html(concertsHTML);
}
