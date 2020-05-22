const loginService = require("../services/login");
const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 2 || !req.body.email || !req.body.pass) {
    return res.sendStatus(400);
  }
  try {
    let { user, data, symbols } = await loginService(req.body.email, req.body.pass);
    let token = await jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: "1d"});
    
    return res.send({ token, data, symbols });
  } catch (err) {
    return res.status(401).send(err);
  }

}