const express = require("express");
const app = express();
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");

/* 
Routes: 

/register
/login
/buy



*/


app.listen(3000, ()=> {
  console.log("server is listening on port 3000");
})

