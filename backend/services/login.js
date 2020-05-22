const { client } = require("../db");
const bcrypt = require("bcrypt");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("../utils/sanitizequotes");
const sanitizeSymbols = require("../utils/sanitizesymbols")

module.exports = async (email, pass) => {

  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: email });
  if (result) {
    console.log(result);

    let correctPass = await bcrypt.compare(pass, result.pass);
    if (!correctPass) {
      throw "Incorrect password";
    } else {

      // Get all symbols listed in the IEX API
      let url = "https://sandbox.iexapis.com/stable/ref-data/symbols?" + queryString.stringify({
        token: process.env.IEX_API_KEY
      })
      let symbols = await requestPromise.get(url);
      symbols = JSON.parse(symbols);
      symbols = sanitizeSymbols(symbols);
      
      // If user has transactions/portoflio, get latest price + open/close for transactions using IEX API
      let symbolHash = {};
      for (let item of result.transactions) {
        if (!symbolHash[item.symbol]) {
          symbolHash[item.symbol] = 1;
        }
      }
      for (let item of result.portfolio) {
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
      let data = sanitizeQuotes(quotes);
      console.log(data);

      // Store latest price info into token
      let user = {
        name: result.name,
        email,
        cash: result.cash,
        transactions: result.transactions,
        portfolio: result.portfolio,
      }

      return {user, data, symbols}
    }

  } else {
    throw "User account does not exist"
  }

}