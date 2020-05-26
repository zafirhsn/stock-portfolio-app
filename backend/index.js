const express = require("express");
const app = express();
const env = require("dotenv").config();
const routes = require("./routes")
const {client, connection} = require("./db");

// Make server accept content-type: application/json requests
app.use(express.json());

//  Only allow requests from whitelisted domain of frontend
app.use("/", (req, res, next)=> {
  res.set({
    "Access-Control-Allow-Origin": `${process.env.FRONTEND_URL}`,
    "Access-Control-Allow-Headers":"Content-Type,Access-Control-Allow-Headers, Authorization, X-Requested-With"
  });
  next();
})

// Connct to db
connection();

// Mount routes to ap
app.use('/', routes)

// Listen on port determined by hosting service
const port = process.env.PORT || 3000
app.listen(port, ()=> {
  console.log("server is listening on port 3000");
})


