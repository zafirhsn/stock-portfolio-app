const updateService = require("../services/update");
const jwt = require("jsonwebtoken");

/**
 * Update controller for /update. Calls update service to update user portfolio. Client must send valid JWT for route access. 
 * @module 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Object} Send any custom exceptions to client and wraps all other exceptions in 500 errors
 */
module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length) {
    return res.sendStatus(400);
  }
  try {
    let token = req.token;
    let payload = jwt.verify(token, process.env.SECRET_KEY) 
    let user = await updateService(payload);
    return res.send({user})

  } catch (err) {
    console.log(err);
    if (err.status) {
      return res.status(err.status).send(err.msg);
    } else {
      return res.sendStatus(500);
    }
  }

}