
/**
 * 
 *
 * @param {*} quotes
 * @returns {Object} Filtered open/close data
 */
module.exports = (quotes) => {
  let a = {};
  for (let stock in quotes) {
    a[stock] = {
      open: quotes[stock].previous.open,
      close: quotes[stock].previous.close
    }
  }
  return a;
}