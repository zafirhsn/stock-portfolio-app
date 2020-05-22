const express = require("express");
const app = express();
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const routes = require("./routes")
const {client, connection} = require("./db");

app.use(express.json());

// ^ Set headers on all responses for CORS access
app.use("/", (req, res, next)=> {
  res.set({
    "Access-Control-Allow-Origin": `${process.env.FRONTEND_URL}`,
    "Access-Control-Allow-Headers":"Content-Type,Access-Control-Allow-Headers, Authorization, X-Requested-With"
  });
  next();
})

connection();

app.use('/', routes)


/* 
Routes: 

/register
/login
/buy

*/


app.listen(3000, ()=> {
  console.log("server is listening on port 3000");
})


