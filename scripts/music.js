import { handleWindow } from "./utils/window.js";
import albums from "./data/albums.js";

const albumSection = $(".albums");

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
    const image = album.image;
    const title = album.title;

    let songsHTML = ``;
    album.songs.forEach((song) => (songsHTML += `<li>${song}</li>`));

    albumHTML += `
      <div class="album">
        <div class="album-img-container">
          <img class="album-img" src="${image}" />
          <div class="album-services">
            <a class="icon-special" href="#">
              <i class="fa-brands fa-spotify"></i>
            </a>
            <a class="icon-special" href="#">
              <i class="fa-brands fa-apple"></i>
            </a>
          </div>
        </div>
        <div class="album-content">          
          <h3 class="album-title">${title}</h3>   
          <ol class="album-songs" type="1">
            ${songsHTML}
          </ol>     
        </div>          
      </div>
    `;
  });

  $("#js-albums").html(albumHTML);
}
