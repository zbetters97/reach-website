import formatCurrency from "../utils/money.js";

export function getProduct(productId) {
  const product =
    productData[products.findIndex((product) => product.id === productId)] ||
    productData[0];

  return product;
}

class Product {
  id;
  name;
  image;
  priceCents;
  colors;
  color;
  edition;
  category;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.name = productDetails.name;
    this.priceCents = productDetails.priceCents;
    this.colors = productDetails.colors;
    this.color = this.colors[0];
    this.edition = productDetails.edition;
    this.category = productDetails.category;
    this.image = `images/shop/${this.category}/${this.category}-${this.edition}-${this.color}.png`;
  }

  getPrice() {
    return formatCurrency(this.priceCents);
  }

  getColorHTML() {
    let colorHTML = ``;
    this.colors.forEach((color) => {
      colorHTML += `<option value="${color}">${color}</option>`;
    });

    return colorHTML;
  }

  changeColor(color) {
    this.color = color;
    return `images/shop/${this.category}/${this.category}-${this.edition}-${color}.png`;
  }

  getExtraHTML() {
    return ``;
  }
}
class Clothing extends Product {
  sizes;

  constructor(productDetails) {
    super(productDetails);
    this.sizes = productDetails.sizes;
    this.size = this.sizes[0];
  }

  changeSize(size) {
    this.size = size;
  }

  getExtraHTML() {
    const select = "checked";

    let sizeHTML = ``;
    this.sizes.forEach((size) => {
      sizeHTML += `
        <label role="radio" class="size-select">
          <input type="radio" name="size-radio" value="${size}" 
          ${this.size === size && select} />
          <p>${size}</p>
        </label>
      `;
    });

    return `
      <div class="size-container">
        <p>Size</p>
        <div class="size-list" data-product-id=${this.id}>
          ${sizeHTML}
        </div>
      </div>
    `;
  }
}

const products = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    name: "RW Modern T-Shirt",
    priceCents: 2500,
    colors: ["Ash", "Indigo", "White"],
    edition: "Modern",
    category: "shirt",
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c7",
    name: "RW Classic T-Shirt",
    priceCents: 2500,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "shirt",
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "77919bbe-0e56-475b-adde-4f24dfed3a04",
    name: "RW Modern Pullover",
    priceCents: 4500,
    colors: ["Ash", "Charcoal"],
    edition: "Modern",
    category: "hoodie",
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "77919bbe-0e56-475b-adde-4f24dfed3a05",
    name: "RW Classic Pullover",
    priceCents: 4500,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "hoodie",
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: "58b4fc92-e98c-42aa-8c55-b6b79996769a",
    name: "RW Modern Hat",
    priceCents: 1500,
    colors: ["Charcoal", "White"],
    edition: "Modern",
    category: "hat",
  },
];

export let productData = [];

export function loadProducts() {
  productData = products.map((product) => {
    if (product.category === "shirt" || product.category === "hoodie") {
      return new Clothing(product);
    } else {
      return new Product(product);
    }
  });

  return productData;
}
