const { client } = require("../db");
const bcrypt = require("bcrypt");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
// const sanitizeQuotes = require("../utils/sanitizequotes");
const sanitizeSymbols = require("../utils/sanitizesymbols")
const updatePortfolio = require('../utils/updateportfolio');
module.exports = async (email, pass) => {

  const collection = client.db("users").collection("users");

  const result = await collection.findOne({ email: email });

  if (result) {
    console.log(result);

    let correctPass = await bcrypt.compare(pass, result.pass);
    if (!correctPass) {
      throw "Incorrect password";
    } else {

      //^ Get all symbols listed in the IEX API
      let url = "https://sandbox.iexapis.com/stable/ref-data/symbols?" + queryString.stringify({
        token: process.env.IEX_API_KEY
      })
      let symbols = await requestPromise.get(url);
      symbols = JSON.parse(symbols);
      symbols = sanitizeSymbols(symbols);
      
      //^ If user has transactions/portfolio, get latest price + open/close for transactions using IEX API
      
      let response = {};
      if (result.transactions.length && result.portfolio.length) {
        console.log("user data does exist")
        let ohlc = await updatePortfolio(result)
        response.ohlc = ohlc;
      }

      let newResult = await collection.findOne({ email: email });
      // Store latest price info into token
      let user = {
        name: newResult.name,
        email,
        cash: newResult.cash,
        transactions: newResult.transactions,
        portfolio: newResult.portfolio  
      }
      response.user = user;
      response.symbols = symbols;

      return response;
    }

  } else {
    throw "User account does not exist"
  }

}