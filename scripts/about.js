import { handleWindow } from "./utils/window.js";
import { members } from "./data/members.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
  showMemberText();
});

function loadPage() {
  renderMembersHTML();
}

function renderMembersHTML() {
  let membersHTML = ``;

  members.forEach((member) => {
    const image = member.image;
    const name = member.name;
    const title = member.title;
    const social = member.social;
    const question = member.question;
    const answer = member.answer;

    membersHTML += `
      <div class="about-member js-about-member">
        <img class="about-member-img" src="${image}" />
        <div class="about-member-info">
          <div class="about-member-banner">
            <h3 class="about-member-name">${name}</h3>
            <div class="about-member-tag">
              <h4 class="about-member-title">${title}</h4>
              <a class="about-member-social" href="${social}" target="_blank">
                <i class="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
          <div class="about-member-quote">
            <p>
              <strong>Q:</strong>
              <em>${question}</em>
            </p>
            <p>
              <strong>A:</strong>
              "${answer}"
            </p>
          </div>
        </div>
      </div>
    `;

    $("#js-members-container").html(membersHTML);
  });
}

function showMemberText() {
  $(".js-about-member").on("click", "img", function () {
    const $target = $(this).siblings(".about-member-info");

    if (!$target.hasClass("active")) {
      $target.addClass("active");
      $target.addClass("members-animate-on");
      $target.removeClass("members-animate-off");
    } else {
      $target.removeClass("active");
      $target.removeClass("members-animate-on");
      $target.addClass("members-animate-off");
    }
  });
}
