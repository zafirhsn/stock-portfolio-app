const express = require("express");
const router = express.Router();
const verifyToken = require('../utils/jwt');
// const registerController = require("../controllers/register");
// const loginController = require("../controllers/login");

// registerController();
// loginController();

const { register, login } = require("../controllers/index");


router.post('/register', register);
router.post('/login', login);

module.exports = router;