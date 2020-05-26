const { client } = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

/**
 * Register service to create new user on db
 * @module
 * @param {string} name
 * @param {string} email
 * @param {string} pass
 * @returns {void} 
 * @throws { Object }
 */
module.exports = async (name, email, pass) => {

  // Retrieve user by email from db
  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: email });

  // If user exists, throw exception
  if (result) {
    throw { status: 200, msg: "An account with that email already exists" };
  } else {
    
    // Salt and hash password using bcrypt
    let hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    console.log(hashedPass)

    // Build user object
    let user = {
      name, 
      email, 
      pass: hashedPass,
      cash: 5000,
      transactions: [],
      portfolio: []
    }

    // Insert new user into db
    let resultDoc = await collection.insertOne(user)

    // If a user was successfully inserted, then return, otherwise, throw 
    if (resultDoc.insertedCount) {
      return
    } else {
      throw "Failed to insert user in db"
    }

  }

}