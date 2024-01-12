// contactService\src\graphql\resolvers\mutations\signUp.js

const {UserInputError} = require("apollo-server-express");
const logger = require("../../utils/logger");

const signUp = async (_, {email, username, password, confirmPassword}, context,) => {

	const existingUserByEmail = await context.dataSources.authAPI.getUserByEmail(email);

	if (existingUserByEmail) {
		logger.error("Email already in use");
		throw new UserInputError("Email already in use");
	}

	const existingUserByUsername = await context.dataSources.authAPI.getUserByUsername(username);

	if (existingUserByUsername) {
		logger.error("Username already in use");
		throw new UserInputError("Username already in use");
	}

	if (password !== confirmPassword) {
		logger.error("Passwords don't match");
		throw new UserInputError("Passwords don't match");
	}

	try {
		const user = await context.dataSources.authAPI.createUser(email, username, password);
		await context.dataSources.chatAPI.createUser(user._id, user.email, user.username);
		await context.dataSources.contactAPI.createUser(user._id, user.email, user.username);
	} catch(error) {
		logger.error(`Password length requirement no satisfied`)
		throw new UserInputError('Password length must be between 8 and 16 characters')
	}

	logger.debug(`AuthAPI | user: ${JSON.stringify(user)}`);


	const token = await context.dataSources.authAPI.getTokenByPayload(user._id, user.email)
	logger.debug(`token: ${JSON.stringify(token)}`);

	context.res.cookie('authToken', token.token, {
		httpOnly: true, maxAge: 3600000, sameSite: 'lax'
	});

	return {token: token.token, user};
};

module.exports = {signUp};
