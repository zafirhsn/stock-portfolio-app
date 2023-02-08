const express = require("express");
const router = express.Router();
const verifyToken = require('../utils/jwt');
const { register, login, buy, update } = require("../controllers/index");
const requestPromise = require("request-promise-native");

// Mount all routes to express router here and export to be used in entry point
router.post('/register', register);
router.post('/login', login);
router.post('/buy', verifyToken, buy);
router.get('/update', verifyToken, update);

module.exports = router;