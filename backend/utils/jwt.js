const jwt = require("jsonwebtoken");

// ^ Verify token middleware
/**
 * JWT middleware for express routes to verify the existence of bearer token in header. Does not check token validity. 
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}   
 */
module.exports = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined 
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token;
    req.token = bearerToken;
    // Call next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}