import { handleWindow } from "./utils/window.js";
import members from "./data/members.js";

const memberSection = $(".about-members");

$(document).ready(function () {
  handleWindow();
  loadPage();
  showMemberText();
});

function loadPage() {
  handleScroll();
  renderMembersHTML();
}

function handleScroll() {
  $(window).scroll(() => {
    fadeUp();
  });
}

function fadeUp() {
  memberSection.children().each(function () {
    const member = $(this);

    const memberTop = member.offset().top;
    const viewportBottom = $(window).scrollTop() + $(window).height();

    const distInView = memberTop < viewportBottom - 200;

    if (distInView) {
      member.addClass("slide-up");
    } else {
      member.removeClass("slide-up");
    }
  });
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
        <img class="member-img" src="${image}" />
        <div class="member-info">
          <div class="member-banner">
            <h3 class="member-name">${name}</h3>
            <div class="member-tag">
              <h4 class="member-title">${title}</h4>
              <a 
                class="member-social" 
                href="${social}" target="_blank"
              >
                <i class="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
          <div class="member-quote">
            <p class="member-question">
              <strong>Q:</strong>
              <em>${question}</em>
            </p>
            <p class="member-answer">
              <strong>A:</strong>
              "${answer}"
            </p>
          </div>

          <a class="member-close-btn">
            <i class="fa-solid fa-circle-xmark"></i>
          </a>
        </div>
      </div>
    `;

    $("#js-about-members").html(membersHTML);
  });
}

function showMemberText() {
  $(".js-about-member").on("click", "img", function () {
    const $target = $(this).siblings(".member-info");

    if (!$target.hasClass("active")) {
      $target.addClass("active");
    } else {
      $target.removeClass("active");
    }
  });

  $(".member-close-btn")
    .children()
    .on("click", function () {
      $(this).parent().parent().removeClass("active");
    });
}
