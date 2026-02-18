const express = require("express");
const route = express.route();

const { login } = require("../controllers/controller.js");

route.post("/login", login);

module.exports = route;
