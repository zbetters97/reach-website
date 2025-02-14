import formatCurrency from "../utils/money.js";

export function getProduct(productId) {
  const product =
    productData[
      products.findIndex((product) => product.productId === productId)
    ] || productData[0];

  return product;
}

class Product {
  productId;
  name;
  image;
  priceCents;
  colors;
  color;
  edition;
  category;

  constructor(productDetails) {
    this.productId = productDetails.productId;
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
      colorHTML += `
        <option value="${color}" ${color === this.color && `selected`}>
          ${color}
        </option>      
      `;
    });

    return colorHTML;
  }

  changeColor(color) {
    this.color = color;
    this.image = `images/shop/${this.category}/${this.category}-${this.edition}-${this.color}.png`;
    return this.image;
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
    Object.keys(this.sizes).forEach((size) => {
      sizeHTML += `
        <label role="radio" class="size-select">
          <input type="radio" name="size-radio" value="${size}" 
          ${size === "Small" && `checked`} 
          ${this.size === size && select} />
          <p>${this.sizes[size]}</p>
        </label>
      `;
    });

    return `
      <div class="size-container">
        <p>Size</p>
        <div class="size-list" data-product-id=${this.productId}>
          ${sizeHTML}
        </div>
      </div>
    `;
  }
}

const products = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    name: "RW Modern T-Shirt",
    priceCents: 2500,
    colors: ["Ash", "Indigo", "White"],
    edition: "Modern",
    category: "shirt",
    sizes: {
      Small: "S",
      Medium: "M",
      Large: "L",
      XLarge: "XL",
      XXLarge: "2XL",
    },
  },
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c7",
    name: "RW Classic T-Shirt",
    priceCents: 2500,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "shirt",
    sizes: {
      Small: "S",
      Medium: "M",
      Large: "L",
      XLarge: "XL",
      XXLarge: "2XL",
    },
  },
  {
    productId: "77919bbe-0e56-475b-adde-4f24dfed3a04",
    name: "RW Modern Pullover",
    priceCents: 4500,
    colors: ["Ash", "Charcoal"],
    edition: "Modern",
    category: "hoodie",
    sizes: {
      Small: "S",
      Medium: "M",
      Large: "L",
      XLarge: "XL",
      XXLarge: "2XL",
    },
  },
  {
    productId: "77919bbe-0e56-475b-adde-4f24dfed3a05",
    name: "RW Classic Pullover",
    priceCents: 4500,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "hoodie",
    sizes: {
      Small: "S",
      Medium: "M",
      Large: "L",
      XLarge: "XL",
      XXLarge: "2XL",
    },
  },
  {
    productId: "58b4fc92-e98c-42aa-8c55-b6b79996769a",
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
