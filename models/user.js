const mongoose = require("mongoose");
const { Schema } = mongoose;
const Object = new mongoose.Types.ObjectId();

const user = new Schema({
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  passwordResetToken: {
    type: String,
    default: undefined,
    required: false,
  },
  passwordResetExpiry: {
    type: Date,
    default: undefined,
    required: false,
  },
});

const User = mongoose.model("User", user);

module.exports = User;
