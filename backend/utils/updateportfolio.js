const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("./sanitizequotes");

module.exports = async (user) => {
  let symbolHash = {};
  for (let item of user.transactions) {
    if (!symbolHash[item.symbol]) {
      symbolHash[item.symbol] = 1;
    }
  }
  for (let item of user.portfolio) {
    if (!symbolHash[item.symbol]) {
      symbolHash[item.symbol] = 1;
    }
  }
  let symbolStr = "";
  for (let key of Object.keys(symbolHash)) {
    symbolStr += key.toLowerCase() + ',';
  }

  url = "https://sandbox.iexapis.com/stable/stock/market/batch?" + queryString.stringify({
    symbols: symbolStr,
    types: "quote",
    token: process.env.IEX_API_KEY
  });

  let quotes = await requestPromise.get(url);
  quotes = JSON.parse(quotes);
  let { data, ohlc } = sanitizeQuotes(quotes);
  console.log(data);
  console.log(ohlc);

  // Update user portfolio in database with new information from IEX and rewrite new data to database
  let newPortfolio = [];
  for (let item of user.portfolio) {
    let value = (data[item.symbol].latestPrice * item.shares).toFixed(2);

    newPortfolio.push({
      symbol: item.symbol,
      shares: item.shares,
      value: Number(value)
    })
  }
  console.log(newPortfolio);
  const collection = client.db("users").collection("users");

  let updateResult = await collection.updateOne({ email: user.email }, { $set: { portfolio: newPortfolio } });


  if (updateResult.modifiedCount) {
    return ohlc;
  } else {
    throw "Internal server error"
  }
  
}