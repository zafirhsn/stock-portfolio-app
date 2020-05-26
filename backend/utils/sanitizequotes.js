
/**
 * Filters data needed from quotes data from IEX
 * @module
 * @function
 * @param {Object} quotes - Body from IEX quotes request
 * @returns {Object} Filtered latestPrice data and open/close {data, ohlc}
 */
module.exports = (quotes) => {
  let data = {};
  let ohlc = {};

  let notOpen = false;
  for (let symbol in quotes) {
    data[symbol] = {
      symbol: quotes[symbol].quote.symbol,
      latestPrice: quotes[symbol].quote.latestPrice
    }

    // Mocks open/close data from IEX if that data does not exist. Used for IEX Sandbox, not production api.
    if (!quotes[symbol].quote.open || !quotes[symbol].quote.close) {
      notOpen = true;
    }
    let open = quotes[symbol].quote.open
    let close = quotes[symbol].quote.close
    ohlc[symbol] = {
      open,
      close
    }
  }
  return { data, ohlc, notOpen };
}