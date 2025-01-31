import { handleWindow } from "./utils/window.js";
import concerts from "./data/concerts.js";
import albums from "./data/albums.js";
import { formatDateMDShort, formatTime } from "./utils/date.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTourHTML();
  renderAlbumHTML();
}

function renderTourHTML() {
  let concertsHTML = ``;

  const homePageConcerts = concerts.slice(0, 3);

  homePageConcerts.forEach((concert) => {
    const date = formatDateMDShort(concert.date);
    const time = formatTime(concert.time);
    const location = `${concert.city}, ${concert.state}`;

    concertsHTML += `
      <div class="home-tour-entry">
        <p>${date} @ ${time} (EST)</p>
        <p>${location}</p>
        <p>${concert.venue}</p>
      </div>
    `;
  });

  concertsHTML += `
    <button class="home-btn home-tour-btn" type="button" onclick="location.href='tour.html'">
      Find more dates
    </button>
  `;

  $("#js-home-tours-container").html(concertsHTML);
}

function renderAlbumHTML() {
  const album = albums[albums.length - 1];
  const image = album.image;
  const title = album.title;

  let songsHTML = ``;
  album.songs.forEach((song) => {
    songsHTML += `<li>${song}</li>`;
  });

  let albumHTML = `
    <img class="home-music-img" src="${image}" />
    <div class="home-music-album" id="js-home-album-container">
      <h3>${title}</h3>
      <ol class="home-music-songs" type="1">
        ${songsHTML}
      </ol>
        <button class="home-btn home-music-btn" type="button" onclick="location.href='music.html'">
          View all releases
        </button>
    </div>
  `;

  $("#js-home-music-container").html(albumHTML);
}
