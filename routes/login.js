const express = require("express");
const loginroute = express.Router();

const { login } = require("../controllers/controller.js");

loginroute.post("/login", login);

module.exports = loginroute;
