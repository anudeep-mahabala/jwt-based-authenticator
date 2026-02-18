const express = require("express");
const registerRoute = express.Router();

const { register } = require("../controllers/controller.js");

registerRoute.post("/create", register);

module.exports = registerRoute;
