
module.exports = (quotes) => {
  let data = {};
  for (let symbol in quotes) {
    data[symbol] = {
      symbol: quotes[symbol].quote.symbol,
      open: quotes[symbol].quote.open,
      close: quotes[symbol].quote.close,
      latestPrice: quotes[symbol].quote.latestPrice
    }
  }
  return data;
}