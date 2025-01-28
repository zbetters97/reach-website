import { handleWindow } from "./utils/window.js";
import albums from "./data/albums.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  renderMusicHTML();
}

function renderMusicHTML() {
  let albumHTML = ``;

  albums.forEach((album) => {
    const year = album.year;
    const image = album.image;
    const title = album.title;

    let songsHTML = ``;
    album.songs.forEach((song) => {
      songsHTML += `<li>${song}</li>`;
    });

    albumHTML += `
      <section class="album-section">
        <div class="album-container">
          <img class="album-img" src="${image}" />
          <div class="album-content">
            <div>
              <h3 class="album-title">${title}</h3>
              <ol type="1" class="album-songs">
                ${songsHTML}
              </ol>
            </div>
            <div class="album-services">
              <a>
                <i class="fa-brands fa-spotify"></i>
              </a>
              <a>
                <i class="fa-brands fa-apple"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  });

  $("#js-albums-container").html(albumHTML);
}
