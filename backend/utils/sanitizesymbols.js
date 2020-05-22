
module.exports = (symbols) => {
  let data = [];
  for (let item of symbols) {
    data.push(item.symbol);
  }
  return data;
}