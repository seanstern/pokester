const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 2,
});
/**
 * Given a numerical amount of money, return a string representation of the
 * amount.
 *
 * @param amt a numerical amount
 * @returns a string representation of the amount.
 */
const toCurrencyFormat = (amt: number) => currencyFormat.format(amt);

export default toCurrencyFormat;
