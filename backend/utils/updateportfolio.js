const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("./sanitizequotes");

/** 
 * Updates user data with latest stock info if they have a portfolio
 * @module
 * @param {Object} user - User object from MongoDB findOne query
 * @returns {Object} Object with user and open/close data {userDoc, ohlc} 
 * @throws Any errors from rejected promises or string
 */
module.exports = async (user) => {

  let ohlc = {};
  let userDoc = user;

  if (user.transactions.length && user.portfolio.length) {
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
    let a = sanitizeQuotes(quotes);
    ohlc = a.ohlc;
    let data = a.data;
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

    if (!updateResult.modifiedCount) {
      throw "Failed to update user with new data";
    } 
    userDoc = await collection.findOne({ email: user.email });
  } 
  return { userDoc, ohlc };
}