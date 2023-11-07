// backend\src\graphql\resolvers\mutations\login.js
const User = require("../../models/UserModel");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../../authUtils");
const logger = require("../../utils/logger");

const login = async (_, { email, password }, context) => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.error(`Invalid email: ${email}`);
    throw new Error("Invalid email");
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    logger.error(`Invalid password for email: ${email}`);
    throw new Error("Invalid password");
  }
  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  context.res.cookie('authToken', token, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: 'lax'
  });

  return {
    token,
    user,
  };
};

module.exports = { login };