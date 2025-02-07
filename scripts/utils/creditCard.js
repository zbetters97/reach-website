export function maskCardNumber(cardNum) {
  const maskedSection = cardNum.slice(0, -4).replace(/\d/g, "&#x25cf;");
  const visibleSection = cardNum.slice(-4);
  return `${maskedSection} ${visibleSection}`;
}
