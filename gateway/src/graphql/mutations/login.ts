const logger = require("../../utils/logger");

const login = async (_: any, {email, password}: any, context: any) => {
	logger.debug(`login attempt for ${email}`);

	const user = await context.dataSources.authAPI.getUserByEmail(email);

	if (!user) {
		logger.error(`No user with email: ${email}`);
		throw new Error(`No user with email: ${email}`);
	}

	const match = await context.dataSources.authAPI.getPasswordComparison(email, password);

	if (!match) {
		logger.error(`Invalid password for email: ${email}`);
		throw new Error("Invalid password");
	}

	const token = await context.dataSources.authAPI.getTokenByPayload(user._id, user.email)

	context.res.cookie('authToken', token.token, {
		httpOnly: true,
		maxAge: 3600000,
		sameSite: 'lax',
		path: '/',
	});

	return {
		token: token.token,
		user,
	};
};

module.exports = {login};
