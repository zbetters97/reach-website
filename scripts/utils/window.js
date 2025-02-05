import { dbGetUser } from "../data/database.js";

export function handleWindow() {
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

  handleAccountPage();
}

function handleAccountPage() {
  $(".js-navbar-user").on("click", async function () {
    try {
      const user = await dbGetUser();
      window.location.href = user ? "account.html" : "login.html";
    } catch (error) {
      window.location.href = "login.html";
      return;
    }
  });
}
