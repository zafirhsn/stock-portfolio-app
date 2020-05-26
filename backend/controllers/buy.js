const buyService = require("../services/buy");
const jwt = require("jsonwebtoken");

/**
 * Buy controller for /buy. Updates user portfolio with new shares if user has enough cash. Protected route with JWT
 * @module
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Object} 200 OK, with new user data { data, ohlc }
 * @throws {Object} Sends any custom exceptions to client and wraps all other exceptions in 500 error
 */
module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 2 || !req.body.ticker || !req.body.quantity) {
    return res.sendStatus(400);
  }
  try {
    let token = req.token;
    let payload = jwt.verify(token, process.env.SECRET_KEY) 
    let { data, ohlc } = await buyService(req.body.ticker, Number(req.body.quantity), payload);
    return res.send({data, ohlc});

  } catch (err) {
    console.log(err);
    if (err.name === "JsonWebTokenError" && err.message === "invalid token") {
      return res.sendStatus(403);
    }
    if (err.status) {
      return res.status(err.status).send(err.msg);
    } else {
      return res.sendStatus(500);
    }
  }
}