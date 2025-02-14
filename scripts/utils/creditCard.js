export function maskCardNumber(cardNum) {
  const maskedSection = cardNum.slice(0, -4).replace(/\d/g, "&#x25cf;");
  const visibleSection = cardNum.slice(-4);
  return `${maskedSection} ${visibleSection}`;
}

export function identifyCardType(cardNum) {
  cardNum = cardNum.replaceAll("-", "");

  const cardPatterns = {
    AMEX: /^3[47]/,
    Discover: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-9][0-9]{2})|64[4-9]|65)/,
    JCB: /^35(2[89]|[3-8][0-9])/,
    MasterCard: /^5[1-5]/,
    Visa: /^4/,
  };

  for (const card in cardPatterns) {
    if (cardPatterns[card].test(cardNum)) {
      return card;
    }
  }

  return "null";
}
