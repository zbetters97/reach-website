import { dbGetUser } from "./database.js";

export class Cart {
  cartItems;

  // private value
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  #generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  }

  addToCart(pId, quantity = 1, category, type, color) {
    const index = this.cartItems.findIndex(
      (p) => p.pId == pId && p.type == type && p.color == color
    );

    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
    } else {
      const deliveryId = category === "T" ? "0" : "1";

      this.cartItems.push({
        cId: this.#generateId(),
        pId: pId,
        category: category,
        quantity: quantity,
        type: type,
        color: color,
        deliveryId: deliveryId,
      });
    }

    this.saveToStorage();
  }

  removeFromCart(cId) {
    const index = this.cartItems.findIndex((p) => p.cId == cId);

    index !== -1 && this.cartItems.splice(index, 1);

    this.saveToStorage();
  }
  emptyCart() {
    this.cartItems = [];
    this.saveToStorage();
  }

  updateQuantity(cId, newQuantity) {
    if (newQuantity === 0) {
      this.removeFromCart(cId);
      return true;
    }
    if (newQuantity > 0 && newQuantity < 100) {
      this.cartItems.forEach((item) => {
        item.cId === cId && (item.quantity = Number(newQuantity));
      });

      this.saveToStorage();

      return true;
    } else {
      return false;
    }
  }
  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((item) => {
      cartQuantity += item.quantity;
    });

    return cartQuantity;
  }

  calculateTotalPriceCents(products) {
    let totalPrice = 0;

    this.cartItems.forEach((item) => {
      const product =
        products[products.findIndex((product) => product.pId == item.id)] ||
        null;

      totalPrice += item.quantity * product.priceCents;
    });

    return totalPrice;
  }

  updateDeliveryOption(cId, deliveryId) {
    this.cartItems.forEach((item) => {
      item.cId === cId && (item.deliveryId = deliveryId);
    });

    this.saveToStorage();
  }
}

let cart = new Cart("rw-cart");
export default cart;
