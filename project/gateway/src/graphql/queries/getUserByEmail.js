const logger = require("../../utils/logger");

const getUserByEmail = async (_, {email}, context) => {
	logger.debug("getUserByEmail", {email});

	const user = await context.dataSources.authAPI.getUserByEmail(email);
	logger.debug(`user: ${JSON.stringify(user)}`);

	if (!user) {
		logger.error(`No user with email: ${email}`);
		throw new Error(`No user with email: ${email}`);
	}

	return user;
}

module.exports = {getUserByEmail};