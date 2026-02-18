const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

const User = require("../models/user.js");

const UserSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5).max(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(8),
});

const register = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const result = UserSchema.safeParse({ name, email, password });
  try {
    if (result.success) {
      const user = await User.findOne({ email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword) {
          const accountHolder = await User.create({
            name,
            password: hashedPassword,
            email,
          });
          const accessToken = jwt.sign(
            { id: accountHolder._id, role: accountHolder.role },
            process.env.ACCESS_SECRET_CODE,
            {
              expiresIn: "15m",
            },
          );
          const refreshToken = jwt.sign(
            { id: accountHolder._id },
            process.env.REFRESH_SECRET_CODE,
            {
              expiresIn: "7d",
            },
          );
          const hashrefreshToken = await bcrypt.hash(refreshToken, 10);
          accountHolder.passwordResetToken = hashrefreshToken;
          await accountHolder.save();
          res.status(201).json({
            success: true,
            message: "Successfully created user",
            accessToken,
            refreshToken,
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
      const error = new Error(result.error);
      error.statusCode = 422;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const inputValidation = LoginSchema.safeParse({ email, password });
  try {
    if (inputValidation.success) {
      const user = await User.findOne({ email });
      if (user) {
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (passwordCheck) {
          const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_SECRET_CODE,
            {
              expiresIn: "15m",
            },
          );
          const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_SECRET_CODE,
            {
              expiresIn: "7d",
            },
          );
          const hashrefreshToken = await bcrypt.hash(refreshToken, 10);
          user.passwordResetToken = hashrefreshToken;
          await user.save();
          res.status(201).json({
            success: true,
            message: "Successfully loged in",
            accessToken,
            refreshToken,
          });
        } else {
          const error = new Error("Invalid Credentials");
          error.statusCode = 401;
          next(error);
        }
      } else {
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        next(error);
      }
    } else {
      const error = new Error(inputValidation.error);
      error.statusCode = 422;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
