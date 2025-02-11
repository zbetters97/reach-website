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

  addToCart(id, quantity = 1, category, type = "One Size", color) {
    const index = this.cartItems.findIndex((p) => p.productId == id);

    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
    } else {
      const deliveryId = category === "T" ? "0" : "1";

      this.cartItems.push({
        productId: id,
        category: category,
        quantity: quantity,
        type: type,
        color: color,
        deliveryOptionId: deliveryId,
      });
    }

    this.saveToStorage();
  }
  removeFromCart(id) {
    const index = this.cartItems.findIndex((p) => p.id == id);
    index !== -1 && this.cartItems.splice(index, 1);

    this.saveToStorage();
  }
  emptyCart() {
    this.cartItems = [];
    this.saveToStorage();
  }

  updateQuantity(id, newQuantity) {
    if (newQuantity > 0 && newQuantity < 1000) {
      this.cartItems.forEach((cartItem) => {
        cartItem.id === id && (cartItem.quantity = Number(newQuantity));
      });

      this.saveToStorage();

      return true;
    } else {
      return false;
    }
  }
  calculateCartQuantity() {
    let cartQuantity = 0;
    this.cartItems.forEach((product) => {
      cartQuantity += product.quantity;
    });

    return cartQuantity;
  }

  calculateTotalPriceCents(products) {
    let totalPrice = 0;

    this.cartItems.forEach((cartItem) => {
      const product =
        products[products.findIndex((product) => product.id == cartItem.id)] ||
        null;

      totalPrice += cartItem.quantity * product.priceCents;
    });

    return totalPrice;
  }

  updateDeliveryOption(id, deliveryId) {
    this.cartItems.forEach((cartItem) => {
      cartItem.id === id && (cartItem.deliveryOptionId = deliveryId);
    });

    this.saveToStorage();
  }
}

let cart = new Cart("rw-cart");
export default cart;
