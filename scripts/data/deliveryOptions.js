import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getDeliveryOption(deliveryId) {
  const deliveryOption =
    deliveryOptions[
      deliveryOptions.findIndex((delivery) => delivery.deliveryId == deliveryId)
    ];

  return deliveryOption || deliveryOptions[0];
}
export function calculateDeliveryDate(deliveryOption) {
  let day = dayjs();

  let daysRemaining = deliveryOption.days;
  while (daysRemaining > 0) {
    day = day.add(1, "days");
    !isWeekend(day) && daysRemaining--;
  }

  return day;
}

export function getDeliveryDaysRemaining(deliveryDate) {
  let today = dayjs();

  let delivery = dayjs(new Date(deliveryDate));

  let hours = delivery.diff(today, "hours");
  const days = Math.floor(hours / 24);

  return days;
}

function isWeekend(day) {
  day = day.format("dddd");
  return day === "Sunday" || day === "Saturday";
}

export const deliveryOptions = [
  {
    deliveryId: "1",
    days: 7,
    priceCents: 0,
  },
  {
    deliveryId: "2",
    days: 3,
    priceCents: 499,
  },
  {
    deliveryId: "3",
    days: 1,
    priceCents: 999,
  },
];
