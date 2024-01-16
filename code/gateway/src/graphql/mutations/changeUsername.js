// contactService/src/graphql/mutations/changeUsername.js
const {AuthenticationError} = require('apollo-server-express');
const logger = require("../../utils/logger");

const changeUsername = async (_, args, context) => {
	logger.debug("changeUsername")
	const {newUsername, currentPassword} = args;
	logger.debug(`New Username: ${newUsername}`);
	const {token} = context;
	if (!token) {
		throw new AuthenticationError('You are not logged in');
	}

	const user = await context.dataSources.authAPI.getUserByToken(token);
	logger.debug(`User found: ${user.email} (${user.id})`);

	if (!user) {
		throw new AuthenticationError('Not user found');
	}

	const match = await context.dataSources.authAPI.getPasswordComparison(currentPassword, user.password);
	logger.debug(`Current password match: ${match}`);

	if (!match) {
		throw new AuthenticationError('Invalid password. Not able to change username!');
	}

	const existingUser = await context.dataSources.authAPI.getUserByUsername(newUsername);

	if (existingUser) {
		throw new Error('Username already taken');
	}

	try {
		logger.debug(`Updating username: ${user.username} to ${newUsername}`);
		const updatedUser = await context.dataSources.authAPI.changeUsername(user.username, newUsername)
		await context.dataSources.chatAPI.changeUsername(user.username, newUsername);
		await context.dataSources.contactAPI.changeUsername(user.username, newUsername);
		logger.debug(`Updated user: ${JSON.stringify(updatedUser)}`);
		return updatedUser;
	} catch (err) {
		throw new Error(`Error updating username: ${err.message}`);
	}

}

module.exports = {changeUsername};
