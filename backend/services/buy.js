const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("../utils/sanitizequotes");
const sanitizeOpen = require('../utils/sanitizeopen');

/**
 * Buy service to purchase shares. First, queries database for user by email and checks if user has enough cash for transactions. Throws if not. If yes, portfolio, transactions, and cash are updated. Returns new user object with open/close data for purchased stock { data, ohlc }
 * @module
 * @param {string} ticker - Stock symbol
 * @param {Number} quantity - Number of shares
 * @param {Object} payload - User data
 * @returns {Object} New user data object with open/close { data, ohlc }
 * @throws {Object}
 */
module.exports = async (ticker, quantity, payload) => {

  // Get user from db
  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: payload.user.email });

  console.log(result);

  // Retrieve quote for ticker symbol from Alpha Vantage API
  url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toLowerCase()}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  let quote = await requestPromise.get(url);
  quote = JSON.parse(quote);
  console.log(quote);

  /* 
  {
  "Global Quote": {
    "01. symbol": "GOOG",
    "02. open": "92.7800",
    "03. high": "92.9700",
    "04. low": "90.8400",
    "05. price": "92.1600",
    "06. volume": "22935823",
    "07. latest trading day": "2023-01-17",
    "08. previous close": "92.8000",
    "09. change": "-0.6400",
    "10. change percent": "-0.6897%"
  }
  
  */

  const latestPrice = quote["05. price"];

  // If the cost of the stock is greater than the cash the user has, throw err "Not enough cash"
  let cost = Number((latestPrice * quantity).toFixed(2))
  if (result.cash < cost) {
    throw { status: 200 , msg: "Not enough cash" }
  } else {


    let newCash = result.cash - cost;

    // Build new portfolio using quote data
    let newPortfolio = [];
    let newStock = true;
    for (let item of result.portfolio) {
      if (item.symbol === ticker) {
        newStock = false;
        newPortfolio.push({
          symbol: item.symbol,
          shares: item.shares + quantity,
          value: Number(((item.shares + quantity) * latestPrice).toFixed(2))
        })
      } else {
        newPortfolio.push(item)
      }
    }
    if (newStock) {
      newPortfolio.push({
        symbol: ticker,
        shares: quantity,
        value: Number((quantity * latestPrice).toFixed(2))
      })
    }

    console.log("newPortfolio", newPortfolio);

    // Update user with new portfolio and transaction
    let updateResult = await collection.updateOne({ email: result.email }, { 
      $set: { 
        cash: newCash,
        portfolio: newPortfolio
      }, 
      $push: { 
        transactions: { 
          symbol: ticker, shares: quantity, price: Number((latestPrice * quantity).toFixed(2)) 
        } 
      } 
    })

    // If fail to update, throw err
    if (!updateResult.modifiedCount) {
      throw "Failed to update user with new data";
    }
  
    const data = await collection.findOne({ email: payload.user.email });

    let obj = {
      cash: data.cash,
      portfolio: data.portfolio,
      transactions: data.transactions
    }

    // For IEX API Sandbox, open and close information is null during market hours. 
    let ohlc = {};
    if (!quote.open) {

      // Get all quote data from stock using previous endpoint
      console.log("getting previous day");
      url = `https://cloud.iexapis.com/stable/stock/${ticker.toLowerCase()}/previous?token=${process.env.IEX_API_KEY}`

      let previous = await requestPromise.get(url);
      previous = JSON.parse(previous);
      ohlc[ticker] = {
        open: previous.open,
        close: previous.close
      }
      console.log(ohlc);
    } else {
      ohlc[ticker] = { open: quote.open, close: quote.close }
    }
    return { data: obj, ohlc };
  }
}