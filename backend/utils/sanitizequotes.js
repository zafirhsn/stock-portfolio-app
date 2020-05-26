
/**
 * Filters data needed from quotes data from IEX
 * @module
 * @function
 * @param {Object} quotes
 * @returns {Object} Filtered latestPrice data and open/close {data, ohlc}
 */
module.exports = (quotes) => {
  let data = {};
  let ohlc = {};
  for (let symbol in quotes) {
    data[symbol] = {
      symbol: quotes[symbol].quote.symbol,
      latestPrice: quotes[symbol].quote.latestPrice
    }
    let open;
    let close;
    if (!quotes[symbol].quote.open) {
      open = Number((Math.random() * 100).toFixed(2));
    } else { open = quotes[symbol].quote.open}
    if (!quotes[symbol].quote.close) {
      close = Number((Math.random() * 100).toFixed(2))
    } else { quotes[symbol].quote.close }
    ohlc[symbol] = {
      open,
      close,
    }
  }
  return { data, ohlc };
}