// contactService\src\graphql\resolvers\mutations\login.js
// const User = require("../../models/UserModel");
const logger = require("../../utils/logger");

const login = async (_, {email, password}, context) => {
	logger.debug("login", {email, password});

	// const user = await User.findOne({ email });

	const user = await context.dataSources.authAPI.getUserByEmail(email);
	logger.debug("got user", user);
	logger.debug("user id: ", user._id);

	if (!user) {
		logger.error(`No user with email: ${email}`);
		throw new Error(`No user with email: ${email}`);
	}

	const match = await context.dataSources.authAPI.getPasswordComparison(password, user.password);
	logger.debug("match", match);

	if (!match) {
		logger.error(`Invalid password for email: ${email}`);
		throw new Error("Invalid password");
	}

	const token = await context.dataSources.authAPI.getTokenByPayload(user._id, user.email)

	context.res.cookie('authToken', token, {
		httpOnly: true,
		maxAge: 3600000,
		sameSite: 'lax'
	});

	return {
		token,
		user,
	};
};

module.exports = {login};
