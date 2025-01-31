export default function formatCurrency(price) {
  const formattedMoney = (Math.round(price) / 100).toFixed(2);

  return formattedMoney;
}
