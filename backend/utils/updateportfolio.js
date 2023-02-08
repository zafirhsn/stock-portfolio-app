const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("./sanitizequotes");
const sanitizeOpen = require('../utils/sanitizeopen');

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
  // If user has stock in portfolio, update. Else, send back same user object with empty ohlc object
  if (user.transactions.length && user.portfolio.length) {

    // Parse user data for every unique stock they own
    let symbolSet = new Set();
    for (let item of user.transactions) {
      symbolSet.add(item.symbol);
    }
    for (let item of user.portfolio) {
      symbolSet.add(item.symbol);
    }

    // Build an array of promises requesting the quote for each symbol from symbolSet
    let quotePromiseArr = [];
    for (let sym of symbolSet) {
      const url = "https://www.alphavantage.co/query?" + queryString.stringify({
        function: "GLOBAL_QUOTE",
        symbol: sym,
        apikey: process.env.ALPHA_VANTAGE_API_KEY 
    });
      quotePromiseArr.push(requestPromise.get(url));
    }
    const quotes = await Promise.all(quotePromiseArr);
    // quotes = JSON.parse(quotes);
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

    // Update user in db with new info
    const collection = client.db("users").collection("users");
    let updateResult = await collection.updateOne({ email: user.email }, { $set: { portfolio: newPortfolio } });

    // // If fail to update, throw db exception
    // if (!updateResult.modifiedCount) {
    //   throw "Failed to update user with new data";
    // } 
    userDoc = await collection.findOne({ email: user.email });
  } 
  return { userDoc, ohlc };
}