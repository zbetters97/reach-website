export default function formatDateMDY(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}
