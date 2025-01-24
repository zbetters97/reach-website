export default function formatCurrency(price) {
  return (Math.round(price) / 100).toFixed(2);
}
