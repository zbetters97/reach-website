import { productData, loadProducts, getProduct } from "./data/products.js";

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
  loadProducts();
  renderProductsHTML();
}

function renderProductsHTML() {
  let productsHTML = ``;

  productData.forEach((product) => {
    productsHTML += `
      <div class="shop-item">
        <img src=${product.image} />
        <h3>${product.name}</h3>
        <p>$${product.getPrice()}</p>
      </div>
    `;
  });

  $("#js-shop-items-grid").html(productsHTML);
}
