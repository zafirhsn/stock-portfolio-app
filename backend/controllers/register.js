const registerService = require("../services/register");

/**
 * Register controller for /register. Calls register service to create user. Throws if user with email already exists.
 * @module
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Object} 200 OK with no data
 * @throws {Object} Sends any custom exceptions to client and wraps all other exceptions in 500 error
 */
module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 3 || !req.body.name || !req.body.email || !req.body.pass) {
    return res.sendStatus(400);
  }
  try {
    await registerService(req.body.name, req.body.email, req.body.pass);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    if (err.status) {
      return res.status(err.status).send(err.msg);
    } else {
      return res.sendStatus(500);
    }

  }

}