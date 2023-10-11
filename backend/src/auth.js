// path: backend\src\auth.js

const User = require("./models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("./logger");

async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, payload };
  } catch (err) {
    logger.error(err); // Log the error
    return { valid: false, payload: null };
  }
};

module.exports = {
  getUserById,
  verifyToken,
};
