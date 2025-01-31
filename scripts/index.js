import { handleWindow } from "./utils/window.js";
import concerts from "./data/concerts.js";
import albums from "./data/albums.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderTourHTML();
  renderAlbumHTML();
}

function renderTourHTML() {
  let eventsHTML = ``;

  const homePageConcerts = concerts.slice(0, 3);

  homePageConcerts.forEach((event) => {
    eventsHTML += `
      <div class="home-tour-entry">
        <p>${event.date} @ ${event.time} (EST)</p>
        <p>${event.city}, ${event.state}</p>
        <p>${event.venue}</p>
      </div>
    `;
  });

  eventsHTML += `
    <button class="home-btn home-tour-btn" type="button" location.href='tours.html'>
      Find more dates
    </button>
  `;

  $("#js-home-tours-container").html(eventsHTML);
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
        <button class="home-btn home-music-btn" type="button" location.href='music.html'>
          View all releases
        </button>
    </div>
  `;

  $("#js-home-music-container").html(albumHTML);
}
