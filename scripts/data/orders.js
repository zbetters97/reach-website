import { dbGetUser } from "./database.js";

export const orders = await loadOrders();

export function addOrder(order) {
  order && (orders.unshift(order), saveToStorage());
}

function saveToStorage() {
  const uid = localStorage.getItem("loggedInUserId");
  localStorage.setItem(`rw-orders-${uid}`, JSON.stringify(orders));
}

export function getOrder(orderId) {
  const order = orders.findIndex((o) => o.orderId == orderId) || orders[0];
  return order;
}

export function getOrderProduct(order, productId) {
  const product =
    order.products.findIndex((p) => p.productId == productId) ||
    order.products[0];
  return product;
}

async function loadOrders() {
  try {
    await dbGetUser();
    const uid = localStorage.getItem("loggedInUserId");

    if (uid) {
      return JSON.parse(localStorage.getItem(`rw-orders-${uid}`)) || [];
    } else {
      throw new Error("no user found");
    }
  } catch (error) {
    console.log(error);
  }
}
