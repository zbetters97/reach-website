import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getDeliveryOption(dId) {
  const deliveryOption =
    deliveryOptions[
      deliveryOptions.findIndex((delivery) => delivery.dId == dId)
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

  const date = day.format("dddd, MMMM D");
  return date;
}

function isWeekend(day) {
  day = day.format("dddd");
  return day === "Sunday" || day === "Saturday";
}

export const deliveryOptions = [
  {
    dId: "1",
    days: 7,
    priceCents: 0,
  },
  {
    dId: "2",
    days: 3,
    priceCents: 499,
  },
  {
    dId: "3",
    days: 1,
    priceCents: 999,
  },
];
