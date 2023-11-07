const logger = require("../../utils/logger");
const User = require("../../models/UserModel");
const getUserById = async (parent, { userId }) => {
  //logger.debug("Calling getUserById", userId);
  const user = User.findById(userId);
  //logger.debug('user', !!user)
  return user;
};
module.exports = { getUserById };
