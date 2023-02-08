
/**
 * Filters data needed from quotes data from Alpha Vantage
 * @module
 * @function
 * @param {Object} quotes - Array of quote results from Alpha Vantage as result of Promise.all()
 * @returns {Object} Filtered latestPrice data and open/close {data, ohlc}
 */
module.exports = (quotes) => {
  let data = {};
  let ohlc = {};

  for (let q of quotes) {
    q = JSON.parse(q);
    const symbol = (q["Global Quote"]["01. symbol"]);
    data[symbol] = {
      symbol: symbol,
      latestPrice: q["Global Quote"]["05. price"],
    }

    let open = q["Global Quote"]["02. open"];
    let close = q["Global Quote"]["08. previous close"];
    ohlc[symbol] = {
      open,
      close
    }
  }
  return { data, ohlc };
}