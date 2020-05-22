const registerService = require("../services/register");

module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 3 || !req.body.name || !req.body.email || !req.body.pass) {
    return res.sendStatus(400);
  }
  try {
    await registerService(req.body.name, req.body.email, req.body.pass);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(401).send(err);
  }

}