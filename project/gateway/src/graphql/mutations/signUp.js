// contactService\src\graphql\resolvers\mutations\signUp.js

const {UserInputError} = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const {publishUserEvent} = require("../../utils/rabbitMQPublisher");

const signUp = async (_, {email, username, password, confirmPassword}, context,) => {
	// Check if email already exists

	// const existingUserByEmail = await User.findOne({email});
	const existingUserByEmail = await context.dataSources.authAPI.getUserByEmail(email);

	if (existingUserByEmail) {
		logger.error("Email already in use");
		throw new UserInputError("Email already in use");
	}

	// const existingUserByUsername = await User.findOne({username});
	const existingUserByUsername = await context.dataSources.authAPI.getUserByUsername(username);

	if (existingUserByUsername) {
		logger.error("Username already in use");
		throw new UserInputError("Username already in use");
	}

	if (password !== confirmPassword) {
		logger.error("Passwords don't match");
		throw new UserInputError("Passwords don't match");
	}

	// const hashedPassword = await encryptPassword(password);
	// const hashedPassword = await context.dataSources.authAPI.getPasswordEncrypted(password);
	// logger.info(`hashedPassword: ${hashedPassword}`);

	// const user = new User({email, username, password: hashedPassword});

	// try {
	// 	await user.save();
	// 	await publishUserEvent("contactService", "UserCreated", {
	// 		id: user.id, email: user.email, username: user.username,
	// 	});
	// 	await publishUserEvent("chatService", "UserCreated", {
	// 		id: user.id, email: user.email, username: user.username,
	// 	});
	//
	// } catch (err) {
	// 	logger.error(`Failed to save user: ${err}`);
	// }

	const user = await context.dataSources.authAPI.createUser(email, username, password);
	logger.debug(`user: ${JSON.stringify(user)}`);

	// const token = jwt.sign({
	// 	id: user.id, email: user.email,
	// }, process.env.JWT_SECRET, {expiresIn: "1h"},);

	const token = await context.dataSources.authAPI.getTokenByPayload(user._id, user.email)
	logger.debug(`token: ${JSON.stringify(token)}`);

	context.res.cookie('authToken', token.token, {
		httpOnly: true, maxAge: 3600000, sameSite: 'lax'
	});

	return {token: token.token, user};
};

module.exports = {signUp};
