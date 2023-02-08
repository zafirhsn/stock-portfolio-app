const { client } = require("../db");
const bcrypt = require("bcrypt");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
// const sanitizeQuotes = require("../utils/sanitizequotes");
const sanitizeSymbols = require("../utils/sanitizesymbols")
const updatePortfolio = require('../utils/updateportfolio');

/**
 * Login service to authenticate user. First, database is queried for user by email. If passwords match, checks to see if user has stock in portfolio. If yes, latest stock info is pulled from IEX API and user's portfolio value is updated. Returns object containing new user data with open/close prices for stock in portfolio + symbols on IEX API. If user has no stock, returns object with user data, empty open/close object + symbols on IEX API 
 * @module
 * @param {string} email
 * @param {string} pass
 * @returns {Object} Object with user info, open/close data, and symbols on IEX API {user, ohlc, symbols}
 * @throws {Object}
 */
module.exports = async (email, pass) => {

  // Get user from db
  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: email });

  // If user exists, check pass against hashed password in db
  if (result) {
    console.log(result);

    let correctPass = await bcrypt.compare(pass, result.pass);
    if (!correctPass) {
      throw { status: 200, msg: "Incorrect password" };
    } else {
      // Get all symbols listed from Finnhub API
      let url = "https://finnhub.io/api/v1/stock/symbol?" + queryString.stringify({
        exchange: "US",
        token: process.env.FINNHUB_API_KEY
      })
      let symbols = await requestPromise.get(url);
      symbols = JSON.parse(symbols);
      symbols = sanitizeSymbols(symbols);
      

      // Update the user's portfolio if they own stocks
      let { userDoc, ohlc } = await updatePortfolio(result)

      // Rebuild user obj without hashed password and send to client
      let user = {
          name: userDoc.name,
          email,
          cash: userDoc.cash,
          transactions: userDoc.transactions,
          portfolio: userDoc.portfolio  
        }
        return { user, ohlc, symbols } 
      }

    } else {
      throw { status: 200, msg: "User account does not exist" }
    }
}