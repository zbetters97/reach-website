import formatCurrency from "../utils/money.js";

export function getProduct(productId) {
  const product =
    products[products.findIndex((product) => product.id === productId)] ||
    products[0];

  return product;
}

class Product {
  id;
  name;
  image;
  priceCents;
  #colors;
  selectedColor;
  edition;
  category;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.name = productDetails.name;
    this.priceCents = productDetails.priceCents;
    this.#colors = productDetails.colors;
    this.selectedColor = this.#colors[0];
    this.edition = productDetails.edition;
    this.category = productDetails.category;
    this.image = `images/shop/${this.category}/${this.category}-${this.edition}-${this.selectedColor}.png`;
  }

  getPrice() {
    return formatCurrency(this.priceCents);
  }
}
class Clothing extends Product {
  sizes;
  selectedSize;

  constructor(productDetails) {
    super(productDetails);
    this.sizes = productDetails.sizes;
    this.selectedSize = this.sizes[0];
  }

  changeSize(size) {
    this.selectedSize = size;
  }
}

const products = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    name: "RW Modern T-Shirt",
    priceCents: 2499,
    colors: ["Ash", "Indigo", "White"],
    edition: "Modern",
    category: "shirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c7",
    name: "RW Classic T-Shirt",
    priceCents: 2499,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "shirt",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "77919bbe-0e56-475b-adde-4f24dfed3a04",
    name: "RW Modern Pullover",
    priceCents: 4499,
    colors: ["Ash", "Charcoal"],
    edition: "Modern",
    category: "hoodie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "77919bbe-0e56-475b-adde-4f24dfed3a05",
    name: "RW Classic Pullover",
    priceCents: 4499,
    colors: ["Black", "Navy"],
    edition: "Classic",
    category: "hoodie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "58b4fc92-e98c-42aa-8c55-b6b79996769a",
    name: "RW Modern Hat",
    priceCents: 1499,
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
