// contactService/src/graphql/mutations/changeUsername.js
const {AuthenticationError} = require('apollo-server-express');
const logger = require("../../utils/logger");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const changeUsername = async (_, args, context) => {
	const {newUsername, currentPassword} = args;
	logger.debug(`New Username: ${newUsername}`);
	const {token} = context;
	if (!token) {
		throw new AuthenticationError('You are not logged in');
	}
	// const user = await getUserFromToken(token);

	const user = await context.dataSources.authAPI.getUserByToken(token);
	logger.debug(`User found: ${user.email} (${user.id})`);

	if (!user) {
		throw new AuthenticationError('Not user found');
	}

	// const match = await comparePassword(currentPassword, user.password);
	const match = await context.dataSources.authAPI.getPasswordComparison(currentPassword, user.password);
	logger.debug(`Current password match: ${match}`);

	if (!match) {
		throw new AuthenticationError('Invalid password. Not able to change username!');
	}

	// const existingUser = await User.findOne({username: newUsername});
	const existingUser = await context.dataSources.authAPI.getUserByUsername(newUsername);

	if (existingUser) {
		throw new Error('Username already taken');
	}

	// try {
	// 	logger.debug(`Updating username: ${user.username} to ${newUsername}`);
	// 	await User.updateOne({username: user.username}, {$set: {username: newUsername}});
	// 	await logger.debug(`Username updated to ${user.username}`);
	//
	// 	await publishUserEvent("contactService", 'UsernameChanged', {
	// 		id: user._id, oldUsername: user.username, newUsername: newUsername
	// 	})
	// 	await publishUserEvent("chatService", 'UsernameChanged', {
	// 		id: user._id, oldUsername: user.username, newUsername: newUsername
	// 	})
	//
	// 	logger.debug(`Updated username: ${user.username} to ${newUsername}`);
	//
	// 	return await User.findOne({username: newUsername});
	// } catch (err) {
	// 	throw new Error(`Error updating username: ${err.message}`);
	// }


}

module.exports = {changeUsername};
