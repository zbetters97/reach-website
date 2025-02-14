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
  const index = orders.findIndex((o) => {
    return o.orderId === orderId;
  });

  const order = orders[index];

  return order;
}

export function getOrderProduct(order, productId) {
  const index = order.items.findIndex((p) => {
    return p.productId === productId;
  });

  const product = order.items[index];

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
