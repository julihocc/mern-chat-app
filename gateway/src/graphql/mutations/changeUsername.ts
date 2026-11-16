// contactService/src/graphql/mutations/changeUsername.js
const {AuthenticationError} = require('../../utils/graphqlErrors');
const logger = require("../../utils/logger");

const changeUsername = async (_: any, args: any, context: any) => {
	logger.debug("changeUsername")
	const {newUsername, currentPassword} = args;
	logger.debug(`New Username: ${newUsername}`);
	const {token} = context;
	if (!token) {
		throw new AuthenticationError('You are not logged in');
	}

	const user = await context.dataSources.authAPI.getUserByToken(token);

	if (!user) {
		throw new AuthenticationError('Not user found');
	}

	logger.debug(`User found: ${user.email}`);

	const match = await context.dataSources.authAPI.getPasswordComparison(user.email, currentPassword);

	if (!match) {
		throw new AuthenticationError('Invalid password. Not able to change username!');
	}

	const existingUser = await context.dataSources.authAPI.getUserByUsername(newUsername);

	if (existingUser) {
		throw new Error('Username already taken');
	}

	const previousUsername = user.username;
	let authUpdated = false;
	let chatUpdated = false;
	const rollback = async (label: any, action: any) => {
		try {
			await action();
		} catch (rollbackError: any) {
			logger.error(`Username rollback failed (${label}): ${rollbackError.message}`);
		}
	};

	try {
		logger.debug(`Updating username: ${previousUsername} to ${newUsername}`);
		const updatedUser = await context.dataSources.authAPI.changeUsername(previousUsername, newUsername);
		authUpdated = true;
		await context.dataSources.chatAPI.changeUsername(previousUsername, newUsername);
		chatUpdated = true;
		await context.dataSources.contactAPI.changeUsername(previousUsername, newUsername);
		return updatedUser;
	} catch (err: any) {
		if (chatUpdated) {
			await rollback("contact username", () => context.dataSources.contactAPI.changeUsername(newUsername, previousUsername));
			await rollback("chat username", () => context.dataSources.chatAPI.changeUsername(newUsername, previousUsername));
		}
		if (authUpdated) {
			await rollback("auth username", () => context.dataSources.authAPI.changeUsername(newUsername, previousUsername));
		}
		throw new Error(`Error updating username: ${err.message}`);
	}

}

module.exports = {changeUsername};
