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

async function loadCart() {
  const uid = localStorage.getItem("loggedInUserId");

  const userKey = `rw-cart-${uid}`;
  const guestKey = "rw-cart-guest";

  const userCart = localStorage.getItem(userKey);
  const guestCart = localStorage.getItem(guestKey);

  try {
    await dbGetUser();

    if (uid) {
      if (userCart) {
        console.log("user cart found!");

        localStorage.removeItem(guestKey);
        return createCart(userKey, JSON.parse(userCart));
      } else if (guestCart) {
        console.log("guest cart found, converted to user cart");

        localStorage.removeItem(guestKey);
        return createCart(userKey, JSON.parse(guestCart));
      } else {
        console.log("no user cart found, guest cart created");

        return new Cart(guestKey);
      }
    } else {
      console.log("no user found, guest cart created");

      return new Cart(guestKey);
    }
  } catch (error) {
    if (guestCart) {
      console.log("no user logged in, guest cart found");

      return createCart(guestKey, JSON.parse(guestCart));
    } else {
      console.log("no guest cart found, guest cart created");

      return new Cart(guestKey);
    }
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
