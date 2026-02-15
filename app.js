const express = require("express");
const cors = require("cors");

const errorHandling = require("./middleware/errorHandling.js");
const { register } = require("./controllers/controller.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", register);

app.use((req, res, next) => {
  res.status(404).json({
    message: "No route found",
  });
});
app.use(errorHandling);

module.exports = app;
