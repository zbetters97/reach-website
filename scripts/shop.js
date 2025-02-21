import { handleWindow } from "./utils/window.js";
import { productData, loadProducts, getProduct } from "./data/products.js";
import cart from "./data/cart.js";

const modal = $("#js-shop-modal");

$(document).ready(function () {
  handleWindow();
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
      <div class="shop-item" data-product-id=${product.productId}>
        <img class="shop-item-img" src=${product.image} />
        <h3 class="shop-item-name">${product.name}</h3>
        <p class="shop-item-price">$${product.getPrice()}</p>
      </div>
    `;
  });

  $("#js-shop-items").html(productsHTML);

  handleModal();
}

function handleModal() {
  $("#js-shop-items")
    .children()
    .on("click", function () {
      const productId = $(this).data("product-id");
      renderModalHTML(productId);

      openModal(modal);
    });
}

function renderModalHTML(productId) {
  const product = getProduct(productId);

  let modalHTML = `  
    <button class="shop-close-btn" id="js-shop-close-modal-btn">&times;</button>

    <div class="shop-modal-container">
      <img 
        class="shop-modal-img"
        id="js-shop-modal-img" 
        src="${product.image}" 
      />

      <div class="shop-modal-details">
        <div class="title-container">
          <h3 class="shop-modal-name">${product.name}</h3>
          <h4 class="shop-modal-price">$${product.getPrice()}</h4>
        </div>

        <div class="color-container">
          <label>Color</label>
          <select class="color-list" id="js-color-list">
            ${product.getColorHTML()}
          </select>
        </div>

        ${product.getExtraHTML()}

        <div class="quantity-container">
          <p>Quantity</p>
          <input 
            class="quantity-list"
            id="js-quantity-list" 
            type="number" 
            value="1" min="1" max="99" 
          />
        </div>

        <div class="shop-modal-btn-container">
          <div class="add-cart-alert" id="js-shop-added-alert">
            <i class="fa-solid fa-check"></i>
            <p>Added to cart</p>
          </div>
          <button class="add-cart-btn shop-add-btn" id="js-shop-add-btn">            
            Add to Cart
          </button>
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

  $(".modal-overlay, #js-shop-close-modal-btn").on("click", () => {
    closeModal(modal);
  });

  $("#js-shop-add-btn").on("click", () => {
    const size = $("input[name='size-radio']:checked").val() || "One Size";
    product.size = size;

    const quantity = $("#js-quantity-list").val();
    if (quantity > 99 || quantity < 1) return;

    cart.addToCart(
      product.productId,
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
    $(".modal-overlay").addClass("active");
  }
}

function closeModal(modal) {
  if (modal != null) {
    modal.removeClass("active");
    $(".modal-overlay").removeClass("active");
  }
}
