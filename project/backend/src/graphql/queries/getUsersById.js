const logger = require("../../logger");
const User = require("../../authService/UserModel");

const getUsersById = async (parent, { userIds }) => {
  logger.debug("Calling getUsersById", userIds);
  return User.find({ _id: { $in: userIds } });
};

module.exports = { getUsersById };
