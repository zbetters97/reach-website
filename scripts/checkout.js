import { handleWindow } from "./utils/window.js";
import cart from "./data/cart.js";
import { loadProducts, getProduct } from "./data/products.js";
import { getConcert } from "./data/concerts.js";

$(document).ready(function () {
  handleWindow();
  loadPage();
});

function loadPage() {
  loadProducts();
  renderCartItemsHTML();
}

function renderCartItemsHTML() {
  let cartItemsHTML = ``;

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    const category = cartItem.category;
    const type = cartItem.type;
    const color = cartItem.color;

    if (category === "S") {
      const product = getProduct(productId);
      console.log(product);
    } else if (category === "T") {
      const concert = getConcert(productId);
      console.log(concert);
    }
  });

  // $("#js-products-container").html(cartItemsHTML);
}
