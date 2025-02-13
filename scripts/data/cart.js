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

  setStorageKey(newKey) {
    this.#localStorageKey = newKey;
  }

  setCartItems(cartItems) {
    this.cartItems = cartItems;
  }

  addToCart(productId, quantity = 1, category, type, color) {
    const index = this.cartItems.findIndex(
      (p) => p.productId == productId && p.type == type && p.color == color
    );

    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
    } else {
      const deliveryId = category === "T" ? "0" : "1";

      this.cartItems.push({
        productId: productId,
        cartId: this.#generateId(),
        category: category,
        quantity: quantity,
        type: type,
        color: color,
        deliveryId: deliveryId,
      });
    }

    this.saveToStorage();
  }

  removeFromCart(cartId) {
    const index = this.cartItems.findIndex((p) => p.cartId == cartId);

    index !== -1 && this.cartItems.splice(index, 1);

    if (this.cartItems.length <= 0) {
      localStorage.removeItem(this.#localStorageKey);
    }
    this.saveToStorage();
  }
  emptyCart() {
    this.cartItems = [];
    localStorage.removeItem(this.#localStorageKey);
  }

  updateQuantity(cartId, newQuantity) {
    if (newQuantity === 0) {
      this.removeFromCart(cartId);
      return true;
    }
    if (newQuantity > 0 && newQuantity < 100) {
      this.cartItems.forEach((item) => {
        item.cartId === cartId && (item.quantity = Number(newQuantity));
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

  containsShopItems() {
    let shopItemFound = false;

    this.cartItems.forEach((item) => {
      item.category === "S" && (shopItemFound = true);
    });

    return shopItemFound;
  }
  containsTicketItems() {
    let ticketItemFound = false;

    this.cartItems.forEach((item) => {
      item.category === "T" && (ticketItemFound = true);
    });

    return ticketItemFound;
  }

  updateDeliveryOption(cartId, deliveryId) {
    this.cartItems.forEach((item) => {
      item.cartId === cartId && (item.deliveryId = deliveryId);
    });

    this.saveToStorage();
  }
}

async function loadCart() {
  const uid = localStorage.getItem("loggedInUserId");

  const userKey = `rw-cart-${uid}`;
  const guestKey = "rw-cart-guest";

  const userCart = localStorage.getItem(userKey);
  const guestCart = localStorage.getItem(guestKey);

  try {
    await dbGetUser();

    if (uid) {
      // USER LOGGED IN
      if (userCart) {
        // USER CART EXISTS, RETURN
        return createCart(userKey, JSON.parse(userCart));
      } else if (guestCart) {
        // GUEST CART EXISTS, RETURN
        localStorage.removeItem(guestKey);
        return createCart(userKey, JSON.parse(guestCart));
      } else {
        // RETURN NEW USER CART
        return new Cart(userKey);
      }
    } else {
      // USER NOT LOGGED IN, RETURN GUEST CART
      return new Cart(guestKey);
    }
  } catch (error) {
    // RETURN EXISTING GUEST CART OR CREATE NEW ONE
    return guestCart
      ? createCart(guestKey, JSON.parse(guestCart))
      : new Cart(guestKey);
  }
}

function createCart(storageKey, cartItems) {
  const tempCart = new Cart(storageKey);

  tempCart.setCartItems(cartItems);
  tempCart.saveToStorage();

  return tempCart;
}

let cart = await loadCart();
export default cart;
