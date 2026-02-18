const express = require("express");
const cors = require("cors");

const errorHandling = require("./middleware/errorHandling.js");
const registerRoute = require("./routes/register.js");
const loginroute = require("./routes/login.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", registerRoute);
app.use("/api/auth", loginroute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "No route found",
  });
});
app.use(errorHandling);

module.exports = app;
