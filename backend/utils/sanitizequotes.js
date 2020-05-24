
module.exports = (quotes) => {
  let data = {};
  let ohlc = {};
  for (let symbol in quotes) {
    data[symbol] = {
      symbol: quotes[symbol].quote.symbol,
      latestPrice: quotes[symbol].quote.latestPrice
    }
    ohlc[symbol] = {
      open: quotes[symbol].quote.open,
      close: quotes[symbol].quote.close,
    }
  }
  return { data, ohlc };
}