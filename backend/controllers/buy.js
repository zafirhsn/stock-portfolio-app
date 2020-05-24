const buyService = require("../services/buy");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (Object.keys(req.body).length !== 2 || !req.body.ticker || !req.body.quantity) {
    return res.sendStatus(400);
  }
  try {
    let token = req.token;

    jwt.verify(token, process.env.SECRET_KEY, (err, payload)=> {
      if (err) {
        console.log(err);
      }
      buyService(req.body.ticker, Number(req.body.quantity), payload).then(({data, ohlc})=> {
        return res.send({ data, ohlc });

      }).catch(err => {
        if (!err.status) {
          return res.sendStatus(500);
        }
        return res.status(err.status).send(err.msg);
      })
    })

    // return res.send(200);
  } catch (err) {
    return res.status(err.status).send(err.msg);
  }
}