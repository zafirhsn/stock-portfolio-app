const express = require("express");
const router = express.Router();
const verifyToken = require('../utils/jwt');
// const registerController = require("../controllers/register");
// const loginController = require("../controllers/login");

// registerController();
// loginController();

const { register, login, buy } = require("../controllers/index");

router.post('/register', register);
router.post('/login', login);
router.post('/buy', verifyToken, buy);

module.exports = router;