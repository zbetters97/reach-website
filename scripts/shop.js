import { handleWindow } from "./utils/window.js";
import { productData, loadProducts, getProduct } from "./data/products.js";
import cart from "./data/cart.js";

const modal = $("#js-shop-modal");

$(document).ready(function () {
  handleWindow();
  loadPage();
  console.log(cart);
});

function loadPage() {
  loadProducts();
  renderProductsHTML();
}

function renderProductsHTML() {
  let productsHTML = ``;

  productData.forEach((product) => {
    productsHTML += `
      <div class="shop-item js-shop-item" data-product-id=${product.pId}>
        <img src=${product.image} />
        <h3>${product.name}</h3>
        <p>$${product.getPrice()}</p>
      </div>
    `;
  });

  $("#js-shop-items-grid").html(productsHTML);

  handleModal();
}

function handleModal() {
  $("#js-shop-items-grid")
    .children()
    .on("click", function () {
      const pId = $(this).data("product-id");
      renderModalHTML(pId);

      openModal(modal);
    });
}

function renderModalHTML(pId) {
  const product = getProduct(pId);

  let modalHTML = `  
    <button class="shop-close-btn" id="js-shop-close-modal-btn">&times;</button>

    <div class="shop-modal-body">
      <div class="shop-modal-container">
        <img
          class="shop-modal-img" id="js-shop-modal-img"
          src="${product.image}"
        />
        <div class="shop-modal-info">
          <div>
            <h3>${product.name}</h3>
            <h4>$${product.getPrice()}</h4>
          </div>

          <div class="color-container">
            <label>Color</label>
            <select id="js-color-list">
              ${product.getColorHTML()}
            </select>
          </div>

          ${product.getExtraHTML()}

          <div class="quantity-container">
            <p>Quantity</p>
            <input id="js-quantity-container" type="number" value="1" min="1" max="99" />
          </div>

          <div class="add-cart-btn-container">
            <div class="shop-added-alert" id="js-shop-added-alert">
              <i class="fa-solid fa-check"></i>
              <p>Added to cart</p>
            </div>
            <button class="add-cart-btn" id="js-add-cart-btn">            
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.html(modalHTML);

  $("#js-color-list").change(function () {
    const color = $(this).val() || product.color;
    product.changeColor(color);
    $("#js-shop-modal-img").attr("src", product.image);
  });

  $("#js-modal-overlay, #js-shop-close-modal-btn").on("click", () => {
    closeModal(modal);
  });

  $("#js-add-cart-btn").on("click", () => {
    const size = $(`input[name="size-radio"]:checked`).val() || "One Size";
    product.size = size;

    const quantity = $("#js-quantity-container").val();
    if (quantity > 99 || quantity < 1) return;

    cart.addToCart(
      product.pId,
      parseInt(quantity),
      "S",
      product.size,
      product.color
    );

    showAddToCartMsg();
  });
}

function showAddToCartMsg() {
  const addedMessage = $("#js-shop-added-alert");
  addedMessage.css("opacity", "1");

  setTimeout(() => {
    addedMessage.css("opacity", "0");
  }, 2000);
}

function openModal(modal) {
  if (modal != null) {
    modal.addClass("active");
    $("#js-modal-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $("#js-modal-overlay").removeClass("active");
  }
}
