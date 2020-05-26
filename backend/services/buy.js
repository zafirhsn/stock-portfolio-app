const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("../utils/sanitizequotes");

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

  // Retrieve quote for ticker symbol from IEX API
  url = `https://sandbox.iexapis.com/stable/stock/${ticker.toLowerCase()}/quote?token=${process.env.IEX_API_KEY}`
  let quote = await requestPromise.get(url);
  quote = JSON.parse(quote);
  console.log(quote);

  // If the cost of the stock is greater than the cash the user has, throw err "Not enough cash"
  let cost = Number((quote.latestPrice * quantity).toFixed(2))
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
          value: Number(((item.shares + quantity) * quote.latestPrice).toFixed(2))
        })
      } else {
        newPortfolio.push(item)
      }
    }
    if (newStock) {
      newPortfolio.push({
        symbol: ticker,
        shares: quantity,
        value: Number((quantity * quote.latestPrice).toFixed(2))
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
          symbol: ticker, shares: quantity, price: Number((quote.latestPrice * quantity).toFixed(2)) 
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

    // For IEX API Sandbox, open and close information is null during market hours. This block mocks open/close data if that data does not exist in response from IEX. 
    let open, close;
    if (!quote.open) {
      open = Number( (Math.random() * Math.floor(quote.latestPrice)).toFixed(2) );
    } else { open = quote.open }
    if (!quote.close) {
      close = Number((Math.random() * Math.floor(quote.latestPrice)).toFixed(2));
    } else { close = quote.close }
    
    let ohlc = {
      [ticker]: { open: open, close: close }
    }
    return { data: obj, ohlc };
  }
}