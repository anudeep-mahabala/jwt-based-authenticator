const mongoose = require("mongoose");
const { Schema } = mongoose;
const Object = new mongoose.Types.ObjectId();

const user = new Schema({
  id: {
    type: Object,
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    unique: true,
    require: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    require: true,
    default: "user",
  },
  passwordResetToken: {
    type: String,
    default: undefined,
    require: false,
  },
  passwordResetExpiry: {
    type: Date,
    default: undefined,
    require: false,
  },
});

const User = mongoose.model("User", user);

module.exports = user;
