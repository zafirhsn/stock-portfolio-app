/**
 * Filters data needed from symbols data from IEX
 * @module
 * @function
 * @param {Object} symbols
 * @returns {Object} Filtered symbols data, {data}
 */
module.exports = (symbols) => {
  let data = [];
  for (let item of symbols) {
    data.push(item.symbol);
  }
  return data;
}