const { client } = require("../db");
const queryString = require("query-string");
const request = require("request");
const requestPromise = require("request-promise-native");
const sanitizeQuotes = require("../utils/sanitizequotes");

module.exports = async (ticker, quantity, payload) => {
  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: payload.user.email });

  if (result) {
    console.log(result);

    url = `https://sandbox.iexapis.com/stable/stock/${ticker.toLowerCase()}/quote?token=${process.env.IEX_API_KEY}`
    let quote = await requestPromise.get(url);
    quote = JSON.parse(quote);
    // console.log(quote);
    // quote.latestPrice = quote.open;
    console.log(quote);
    let cost = Number((quote.latestPrice * quantity).toFixed(2))

    if (result.cash < cost) {
      throw { status: 401 , msg: "Not enough cash" }
    } else {

      let newCash = result.cash - cost;
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
      if (updateResult.modifiedCount) {
        const data = await collection.findOne({ email: payload.user.email });

        let obj = {
          cash: data.cash,
          portfolio: data.portfolio,
          transactions: data.transactions
        }


        ohlc = {
          [ticker]: { open: quote.open, close: quote.close }
        }
        return { data: obj, ohlc };

      } else {
        throw "Error"
      }

    }


  } else {
    throw { status: 403, msg: "Forbidden" }
  }
}