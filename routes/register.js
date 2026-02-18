const express = require("express");
const route = express.Router();

const { register } = require("../controllers/controller.js");

route.post("/create", register);

module.exports = route;
