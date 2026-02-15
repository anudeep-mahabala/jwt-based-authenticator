const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

const { User } = require("../models/user.js");

const UserSchema = z.object({
  username: z.string().min(5),
  email: z.email(),
  password: z.min(5).max(8).string(),
});

const register = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const result = UserSchema.safeParse({ username, email, password });
  try {
    if (result.success) {
      const user = await User.findOne({ username });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword) {
          await User.create({ username, password: hashedPassword, email });
          res.status(201).json({
            success: true,
            message: "Successfully created user",
          });
        } else {
          const error = new Error("Couldn't create hash and create DB");
          error.statusCode = 500;
          next(error);
        }
      } else {
        const error = new Error("User already exists");
        error.statusCode = 409;
        next(error);
      }
    } else {
      const error = new Error(result.message);
      error.statusCode = 422;
      next(error);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  register,
};
