import { handleWindow } from "./utils/window.js";
import { productData, loadProducts, getProduct } from "./data/products.js";

const modal = $("#js-modal");

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
      <div class="shop-item js-shop-item" data-product-id=${product.id}>
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

function renderModalHTML(productId) {
  const product = getProduct(productId);

  let modalHTML = `  
    <button class="close-btn" id="js-close-modal-btn">&times;</button>

    <div class="modal-body">
      <div class="modal-container">
        <img
          class="modal-img" id="js-modal-img"
          src="${product.image}"
        />
        <div class="modal-info">
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
            <input type="number" value="1" min="1" max="99" />
          </div>

          <button class="modal-cart-btn">
            <i class="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  modal.html(modalHTML);

  $("#js-color-list").change(function () {
    const newImage = product.changeColor($(this).val());
    $("#js-modal-img").attr("src", newImage);
  });

  $("#js-overlay, #js-close-modal-btn").on("click", () => {
    closeModal(modal);
  });
}

function openModal(modal) {
  if (modal == null) return;

  modal.addClass("active");
  $("#js-overlay").addClass("active");
}

function closeModal(modal) {
  if (modal == null) return;

  modal.removeClass("active");
  $("#js-overlay").removeClass("active");
}
