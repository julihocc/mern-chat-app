const logger = require("../../logger");
const User = require("../../authService/UserModel");
const { UserInputError } = require("apollo-server-express");
const getContacts = async (parent, { userId }, _) => {
  //logger.debug("Calling getContacts")
  //logger.debug(userId)
  const user = await User.findById(userId);
  if (!user) {
    throw new UserInputError("User not found");
  }
  if (!user.contacts) {
    throw new UserInputError("Contacts not found");
  }
  //logger.debug(user.contacts)
  return user.contacts;
};
module.exports = { getContacts };
