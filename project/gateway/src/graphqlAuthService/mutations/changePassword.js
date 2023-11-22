// contactService/src/graphql/mutations/changePassword.js
const User = require("../../models/UserModel");
const {
	getUserFromToken, comparePassword, encryptPassword,
} = require("../../utils/authentication");
const {
	AuthenticationError, UserInputError,
} = require("apollo-server-express");
const logger = require("../../utils/logger");

const changePassword = async (_, {oldPassword, newPassword}, context) => {
	if (oldPassword === newPassword) {
		throw new UserInputError("New password cannot be the same as old password");
	}

	const hashedOldPassword = await encryptPassword(oldPassword);
	const hashedNewPassword = await encryptPassword(newPassword);

	const {token} = context;

	if (!token) {
		throw new AuthenticationError("You must be logged in");
	}

	const user = await getUserFromToken(token);

	if (!user) {
		throw new AuthenticationError("User not found");
	} else {
		logger.debug(`User found: ${user.email} (${user.id})`);
	}

	const currentHashedPassword = user.password;
	logger.debug(`Current hashed password: ${currentHashedPassword}`);


	const isPasswordValid = await comparePassword(oldPassword, user.password);
	if (!isPasswordValid) {
		throw new UserInputError("Incorrect password. Look at changePassword,js for more details");
	}

	if (currentHashedPassword === hashedNewPassword) {
		throw new UserInputError("New password cannot be the same as old password");
	}

	try {
		logger.debug(`Changing password for user: ${user.email}`);
		await User.updateOne({email: user.email}, {$set: {password: hashedNewPassword}},);
		const updatedUser = await User.findOne({email: user.email});
		logger.debug(`Updated user: ${JSON.stringify(updatedUser)}`);
		return updatedUser;
	} catch (err) {
		logger.error(`Error changing password: ${err.message}`);
		throw new Error("Error changing password");
	}
};

module.exports = {changePassword};
