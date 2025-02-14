import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getCurrentDate() {
  const date = dayjs().format("dddd, MMMM D");
  return date;
}

export function formatDateDMY(date) {
  return dayjs(date).format("dddd, MMMM D");
}

export function formatDateMDLong(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  return formattedDate;
}

export function formatDateMDShort(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export function formatDateMDYLong(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

export function formatTime(time) {
  const formattedTime = new Date(`1970-01-01T${time}Z`).toLocaleTimeString(
    "en-US",
    { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" }
  );

  return formattedTime;
}
