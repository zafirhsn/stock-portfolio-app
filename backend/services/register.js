const { client } = require("../db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = async (name, email, pass) => {

  const collection = client.db("users").collection("users");
  const result = await collection.findOne({ email: email });
  if (result) {
    throw "An account with that email already exists";
  } else {
    
    let hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
    console.log(hashedPass)

    let user = {
      name, 
      email, 
      pass: hashedPass,
      cash: 5000,
      transactions: [],
      portfolio: []
    }
    let resultDoc = await collection.insertOne(user)
    console.log("insertedCount", resultDoc.insertedCount);
    console.log("insertedId", resultDoc.insertedId);

    return
  }

}