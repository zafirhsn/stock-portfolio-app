const loginService = require("../services/login");
const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 2 || !req.body.email || !req.body.pass) {
    return res.sendStatus(400);
  }
  try {
    let data = await loginService(req.body.email, req.body.pass);
    let token = await jwt.sign({user: data.user}, process.env.SECRET_KEY, {expiresIn: "1d"});
    
    let response = {}
    response.token = token;
    if (data.ohlc) {
      response.ohlc = data.ohlc
    }
    response.symbols = data.symbols;


    return res.send(response);
  } catch (err) {
    if (err === "Incorrect password" || err === "User account does not exist") {
      return res.status(401).send(err);
    } else {
      return res.sendStatus(500);
    }

  }

}