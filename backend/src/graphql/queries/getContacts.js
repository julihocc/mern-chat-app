const logger = require("../../logger");
const User = require("../../models/UserModel");
const {UserInputError} = require("apollo-server-express");
const getContacts= async (parent, {userId}, _) => {
    //logger.info("Calling getContacts")
    //logger.info(userId)
    const user = await User.findById(userId);
    if (!user) {
        throw new UserInputError('User not found');
    }
    if (!user.contacts) {
        throw new UserInputError('Contacts not found');
    }
    //logger.info(user.contacts)
    return user.contacts;
}
module.exports = {getContacts};
