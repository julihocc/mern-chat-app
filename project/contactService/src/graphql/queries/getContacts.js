const logger = require("../../utils/logger");
const User = require("../../models/UserModel");
const {UserInputError} = require("apollo-server-express");
const getContacts = async (parent, {userId}, _) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new UserInputError("User not found");
	}
	if (!user.contacts) {
		throw new UserInputError("Contacts not found");
	}
	return user.contacts;
};
module.exports = {getContacts};
