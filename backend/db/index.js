const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://zafir:${process.env.DB_PASSWORD}@main-hj683.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

function connection() {
  client.connect(err => { 
    console.log("Successfully connected to db...")
  })
} 

// Export db connection and client to use in entry point
module.exports =  {
  client,
  connection 
}