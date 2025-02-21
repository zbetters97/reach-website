import { dbGetUser, dbLogout } from "../data/database.js";

export function handleWindow() {
  const getOffset = () => $("header").offset().top;
  let contentOffset = getOffset();

  $(window).resize(() => (contentOffset = getOffset()));

  $(window).scroll(() => {
    $(window).scrollTop() > contentOffset
      ? $(".to-top").css("opacity", ".9")
      : $(".to-top").css("opacity", "0");
  });

  $(".to-top").click(() => {
    $("body, html").animate({ scrollTop: $("header").offset().top }, 800);
    return !1;
  });

  $(document).on("click", () => {
    $(".user-icon").removeClass("is-active");
    $(".nav-user-dropdown").css("visibility", "hidden");
  });

  const hamburger = $(".hamburger");
  const navOverlay = $(".mobile-nav-overlay");

  const showMobileMenu = function () {
    if (hamburger.hasClass("is-active")) {
      hamburger.removeClass("is-active");
      $(".mobile-nav").removeClass("is-active");
      navOverlay.removeClass("active");
      $("body").removeClass("lock-scroll");
    } else {
      hamburger.addClass("is-active");
      $(".mobile-nav").addClass("is-active");
      navOverlay.addClass("active");
      $("body").addClass("lock-scroll");
    }
  };

  hamburger.on("click", () => showMobileMenu());
  navOverlay.on("click", () => showMobileMenu());

  handleAccountPage();
}

function handleAccountPage() {
  $(".nav-user-icon-container").on("click", async function () {
    try {
      const user = await dbGetUser();

      $(".nav-dropdown-header").html(`Hi, ${user.firstName}`);

      $(".user-icon").addClass("is-active");
      $(".nav-user-dropdown").css("visibility", "unset");
    } catch (error) {
      window.location.href = "login.html";
    }
  });

  $(".mobile-nav-user").on("click", async function () {
    try {
      const user = await dbGetUser();
      window.location.href = user ? "account.html" : "login.html";
    } catch (error) {
      window.location.href = "login.html";
    }
  });

  $(".nav-logout-link").on("click", () => {
    dbLogout();
  });
}
