const { client } = require("../db");
const updatePortfolio = require('../utils/updateportfolio');

/**
 * Updates user portfolio value with latest price of all stocks in portfolio
 * 
 * @module
 * @param {Object} payload - Payload object from JWT
 * @returns {Object} 200 OK, with new user data {user}
 * @throws {Object}
 */
module.exports = async (payload) => {

  // Get user
  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: payload.user.email });

  console.log(result);

  // Update user
  let { userDoc, ohlc } = await updatePortfolio(result);

  let user = {
    name: userDoc.name,
    email: userDoc.email,
    cash: userDoc.cash,
    transactions: userDoc.transactions,
    portfolio: userDoc.portfolio  
  }

  // Send user back
  return user;

}