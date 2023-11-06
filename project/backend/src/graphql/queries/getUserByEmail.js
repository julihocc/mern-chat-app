const User = require("../../authService/UserModel");
const getUserByEmail = async (parent, { email }) => {
  return User.findOne({ email });
};
module.exports = { getUserByEmail };
