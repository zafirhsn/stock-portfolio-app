const loginService = require("../services/login");
const jwt = require("jsonwebtoken");

/**
 * Login controller for /login. First, calls login service for user data, symbols, and open/close data. Signs a JWT with user info as payload. Sends back token, open/close info, and symbols. 
 * @module
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @returns { Object } 200 OK, with { token, ohlc, symbols }
 * @throws { Object } Sends any custom exceptions to client and wraps all other exceptions in 500 error
 */
module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 2 || !req.body.email || !req.body.pass) {
    return res.sendStatus(400);
  }
  try {
    let { user, ohlc, symbols } = await loginService(req.body.email, req.body.pass);
    let token = await jwt.sign({user: user}, process.env.SECRET_KEY, {expiresIn: "1d"});

    return res.send({ token, ohlc, symbols });

  } catch (err) {
    console.log(err);
    if (err.status) {
      return res.status(err.status).send(err.msg);
    } else {
      return res.sendStatus(500);
    }
  }
}